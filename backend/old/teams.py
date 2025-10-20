import requests
from bs4 import BeautifulSoup
import re
import time
import pandas as pd
import warnings

warnings.simplefilter(action='ignore')

class PingPocketQuery(object):

    CLUB = '08940524'  # USFTT 08940073 / Longvic: 02210081
    ONLINE = True

    @staticmethod
    def run():
        PingPocketQuery._get_joueurs_classements()


    @staticmethod
    def _get_joueurs_classements():
        joueurs = []
        for licence in PingPocketQuery._get_list_licences():
            detail = PingPocketQuery._get_licence_details(licence['id'])
            joueurs.append(detail)
            time.sleep(2)

    @staticmethod
    def _get_list_licences():
        soup = PingPocketQuery._api_call('clubs/'+ PingPocketQuery.CLUB +'/licencies?SORT=OFFICIAL_RANK')
        innerContent = soup.find('ul', class_="edgetoedge")
        
        res = []
        for link in innerContent.findAll('a'):
            match = re.search(r'licencies/(\d+)', link['href'])
            res.append({
                'id': match.group(1),
            })

        return res
    

    @staticmethod
    def _get_licence_details(licenceId):
        soup = PingPocketQuery._api_call('licencies/'+licenceId+'/licence')

        # Extraction du nom
        nom = soup.find('h1').get_text(strip=True)

        # Extraction de la date de validation (li contenant "Validation date")
        date_validation = None
        for li in soup.find_all('li', class_='item-container'):
            label = li.get_text()
            if "Validation date" in label:
                date_val = li.find('small', class_='counter').get_text(strip=True)
                if date_val.endswith('/25'):
                    date_validation = date_val
                else:
                    date_validation = None

        # Extraction des points officiels (li contenant "Official points")
        points_officiels = None
        for li in soup.find_all('li', class_='item-container'):
            label = li.get_text()
            if "Official points" in label:
                points_officiels = li.find('small', class_='counter').get_text(strip=True)

        if date_validation is not None:
            print(nom +','+points_officiels)

    @staticmethod
    def _api_call(url):
        #print(url)
        response = requests.get('https://www.pingpocket.fr/app/fftt/' + url, 
                                headers={"X-Requested-With":"XMLHttpRequest"})
        
        if response.status_code == 200:
            return BeautifulSoup(response.text, 'html.parser')
        else:
            print(f"Erreur lors de la récupération de la page : {response.status_code}")

if __name__ == '__main__':
    PingPocketQuery().run()