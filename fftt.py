import hashlib
import hmac
import time
import random
import string
import requests
import xml.etree.ElementTree as ET
import argparse
import json
import sys
import os
from pathlib import Path


# ============================================================
# 🧠 Classe principale du client FFTT
# ============================================================

class FFTTApiClient:
    BASE_URL = "http://www.fftt.com/mobile/pxml/"

    def __init__(self, app_id: str, password: str, serie: str = None):
        """
        Initialise le client API FFTT.
        :param app_id: Identifiant d’application fourni par la FFTT (ex: "A001")
        :param password: Mot de passe FFTT pour le chiffrement
        :param serie: Numéro de série utilisateur (15 caractères alphanumériques)
        """
        self.app_id = app_id
        self.password = password
        self.serie = serie or self._generate_serie()

    # ------------------------------------------------------------
    # 🔐 Authentification & sécurité
    # ------------------------------------------------------------
    def _generate_serie(self) -> str:
        """Génère un numéro de série unique pour l’utilisateur."""
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=15))

    def _timestamp(self) -> str:
        """Génère le timestamp au format attendu : YYYYMMDDHHMMSSmmm"""
        return time.strftime("%Y%m%d%H%M%S") + f"{int(time.time() * 1000) % 1000:03d}"

    def _compute_tmc(self, timestamp: str) -> str:
        """Calcule le hash SHA1 du timestamp avec la clé MD5 du mot de passe."""
        ccle = hashlib.md5(self.password.encode('utf-8')).hexdigest()
        tmc = hmac.new(ccle.encode('utf-8'), timestamp.encode('utf-8'), hashlib.sha1).hexdigest()
        return tmc

    def _base_params(self) -> dict:
        """Construit les paramètres communs à toutes les requêtes."""
        tm = self._timestamp()
        tmc = self._compute_tmc(tm)
        return {
            "serie": self.serie,
            "tm": tm,
            "tmc": tmc,
            "id": self.app_id
        }

    # ------------------------------------------------------------
    # 🌐 Communication HTTP + parsing XML
    # ------------------------------------------------------------
    def _get(self, endpoint: str, **kwargs) -> ET.Element:
        """Exécute une requête GET et retourne la racine XML."""
        params = self._base_params()
        params.update(kwargs)
        url = f"{self.BASE_URL}{endpoint}.php"
        
        # Prepare request and print full URL with params
        prepared_request = requests.Request('GET', url, params=params).prepare()
        print(f"🌐 Calling: {prepared_request.url}")
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return ET.fromstring(response.text)

    @staticmethod
    def _xml_to_dict(elem: ET.Element) -> dict:
        """Convertit un élément XML en dictionnaire Python récursif."""
        def parse_element(e):
            children = list(e)
            if not children:
                return e.text
            result = {}
            for c in children:
                if c.tag not in result:
                    result[c.tag] = parse_element(c)
                else:
                    if not isinstance(result[c.tag], list):
                        result[c.tag] = [result[c.tag]]
                    result[c.tag].append(parse_element(c))
            return result
        return {elem.tag: parse_element(elem)}

    def _get_dict(self, endpoint: str, **kwargs) -> dict:
        """Exécute la requête et retourne le résultat en dictionnaire."""
        xml_data = self._get(endpoint, **kwargs)
        return self._xml_to_dict(xml_data)

    # ------------------------------------------------------------
    # 📘 Fonctions d’accès aux endpoints FFTT
    # ------------------------------------------------------------
    def initialisation(self):
        return self._get_dict("xml_initialisation")

    def club_dep(self, dep: str):
        return self._get_dict("xml_club_dep2", dep=dep)

    def club_recherche(self, **kwargs):
        return self._get_dict("xml_club_b", **kwargs)

    def club_detail(self, numero_club: str):
        return self._get_dict("xml_club_detail", club=numero_club)
    
    def list_joueurs_club(self, numero_club: str):
        return self._get_dict("xml_liste_joueur", club=numero_club)
    
    # ?? error 500
    def licences_club(self, numero_club: str):
        return self._get_dict("xml_licence_b", club=numero_club)

    def joueur_detail(self, licence: str):
        return self._get_dict("xml_joueur", licence=licence)

    def licence_detail(self, licence: str):
        return self._get_dict("xml_licence", licence=licence)

    def historique_classement(self, licence: str):
        return self._get_dict("xml_histo_classement", numlic=licence)

    def parties_joueur(self, licence: str):
        return self._get_dict("xml_partie_mysql", licence=licence)
    
    def parties_spid(self, licence: str):
        return self._get_dict("xml_partie", numlic=licence)

    def equipes_club(self, numero_club: str):
        return self._get_dict("xml_equipe", numclu=numero_club)
    
    def rencontre_equipes(self, poule: str):
        return self._get_dict("xml_rencontre_equ", poule=poule)


# ============================================================
# 🧰 Interface CLI
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="Client CLI pour l'API FFTT Smartping 2.0")
    parser.add_argument("endpoint", help="Nom du point d'accès (ex: club_dep, joueur_detail, etc.)")
    parser.add_argument("params", nargs="*", help="Paramètres clé=valeur (ex: dep=75 ou licence=1234567)")
    parser.add_argument("--json", action="store_true", help="Affiche le résultat au format JSON")

    args = parser.parse_args()

    # Initialize FFTT client
    try:
        client = FFTTApiClient(
            app_id=os.environ['FFTT_APP_ID'],
            password=os.environ['FFTT_PASSWORD'],
            serie=os.environ.get('FFTT_SERIE')
        )
    except KeyError:
        print("❌ Aucun identifiant ou mot de passe fourni (et aucune variable d'environnement trouvée).")
        print("➡️  Ajoutez FFTT_APP_ID et FFTT_PASSWORD dans le fichier .env")
        sys.exit(1)

    # Conversion des paramètres "clé=valeur"
    params = {}
    for p in args.params:
        if "=" in p:
            k, v = p.split("=", 1)
            params[k] = v

    if not hasattr(client, args.endpoint):
        print(f"❌ Endpoint inconnu : {args.endpoint}")
        sys.exit(1)

    func = getattr(client, args.endpoint)
    result = func(**params)

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(result)


if __name__ == "__main__":
    main()
