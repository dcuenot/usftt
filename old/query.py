import requests
from bs4 import BeautifulSoup
import re
import time
import pandas as pd
import warnings

warnings.simplefilter(action='ignore')

class PingPocketQuery(object):

    CLUB = '08940073'  # USFTT 08940073 / Longvic: 02210081
    ONLINE = True

    @staticmethod
    def run():
        if PingPocketQuery.ONLINE:
            df_joueurs = PingPocketQuery._get_joueurs_classements()
            df_joueurs.to_csv('out.csv') 
        else:
            df_joueurs = pd.read_csv('out.csv', index_col=0)

        df_competiteurs = df_joueurs[df_joueurs['typeLicence'] == 'C']
        df_competiteurs.loc[df_competiteurs["progressionMensuelle"] == "x", "progressionMensuelle"] = 0
        df_competiteurs.loc[df_competiteurs["progressionGenerale"] == "x", "progressionGenerale"] = 0
        df_competiteurs[['progressionMensuelle', 'progressionGenerale']] = df_competiteurs[['progressionMensuelle', 'progressionGenerale']].apply(pd.to_numeric)
        df_competiteurs.sort_values(by=['progressionMensuelle'], inplace=True, ascending=False)
        
        # All
        all_h = PingPocketQuery._filter_by_categorie(df_competiteurs, '', 'H')
        all_f = PingPocketQuery._filter_by_categorie(df_competiteurs, '', 'F')

        # Poussin
        poussin_h = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Poussin', 'H')
        poussin_f = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Poussin', 'F')

        # Benjamin
        benjamin_h = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Benjamin', 'H')
        benjamin_f = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Benjamin', 'F')

        # Minime
        minime_h = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Minime', 'H')
        minime_f = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Minime', 'F')

        # Cadet
        cadet_h = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Cadet', 'H')
        cadet_f = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Cadet', 'F')

        # Junior
        junior_h = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Junior', 'H')
        junior_f = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Junior', 'F')

        # Senior H
        senior_h = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Sénior', 'H')
        senior_f = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Sénior', 'F')

        # Vétéran
        veteran_h = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Vétéran', 'H')
        veteran_f = PingPocketQuery._filter_by_categorie(df_competiteurs, 'Vétéran', 'F')
        
        with pd.ExcelWriter('progressionMensuelle.xlsx') as writer:
            all_f.to_excel(writer, sheet_name='All F')
            all_h.to_excel(writer, sheet_name='All H')
            
            poussin_f.to_excel(writer, sheet_name='Poussin F')
            poussin_h.to_excel(writer, sheet_name='Poussin H')
            benjamin_f.to_excel(writer, sheet_name='Benjamin F')
            benjamin_h.to_excel(writer, sheet_name='Benjamin H')
            minime_f.to_excel(writer, sheet_name='Minime F')
            minime_h.to_excel(writer, sheet_name='Minime H')
            cadet_f.to_excel(writer, sheet_name='Cadet F')
            cadet_h.to_excel(writer, sheet_name='Cadet H')
            junior_f.to_excel(writer, sheet_name='Junior F')
            junior_h.to_excel(writer, sheet_name='Junior H')
            senior_f.to_excel(writer, sheet_name='Senior F')
            senior_h.to_excel(writer, sheet_name='Senior H')
            veteran_f.to_excel(writer, sheet_name='Veteran F')
            veteran_h.to_excel(writer, sheet_name='Veteran H')

    @staticmethod
    def _filter_by_categorie(df, categorie, sex):
        print()
        print('***** ' + categorie + ' - ' + sex)

        df_out = df[(df['categorie'].str.contains(categorie)) & (df['sex'] == sex)]
        df_out.drop(columns=['typeLicence', 'sex'], inplace=True)
        print(df_out[['name', 'pointsDebutPhase', 'pointsMensuels', 'progressionMensuelle', 'progressionGenerale']].head(10).to_string(index=False))

        return df_out


    @staticmethod
    def _get_joueurs_classements():
        joueurs = []
        for licence in PingPocketQuery._get_list_licences():
            detail = PingPocketQuery._get_licence_details(licence['id'], licence['sex'])
            joueurs.append(detail)
            time.sleep(2)

        df_joueurs = pd.DataFrame.from_dict(joueurs)
        df_joueurs.set_index('licence', inplace=True)

        return df_joueurs

    @staticmethod
    def _get_list_licences():
        soup = PingPocketQuery._api_call('clubs/'+ PingPocketQuery.CLUB +'/licencies?SORT=CATEGORY')
        innerContent = soup.find('ul', class_="edgetoedge")
        
        res = []
        for link in innerContent.findAll('a'):
            match = re.search(r'licencies/(\d+)', link['href'])
            res.append({
                'id': match.group(1),
                'sex': link.find('div', class_='icon').find('i')['class'][1][3:]
            })

        return res
    

    @staticmethod
    def _get_licence_details(licenceId, sex):
        soup = PingPocketQuery._api_call('licencies/'+licenceId+'?CLUB_ID='+PingPocketQuery.CLUB)

        name = soup.find('h1').text.strip()
        spans = soup.find('div', class_='info border').findAll('span')

        categorie = spans[0].text.strip()
        typeLicence = spans[4].text.strip()

        innerContent = soup.find('ul', class_="rounded").findAll('li')

        pointsMensuels = innerContent[1].find('small').text.strip()
        print(innerContent)
        print(innerContent[2].find('small').text.strip())
        print(innerContent[3].find('small').text.strip())
        print(innerContent[4].find('small').text.strip())
        print(innerContent[5].find('small').text.strip())
        if innerContent[3].find('small'):
            pointsDebutPhase = innerContent[2].find('small').text.strip()
            pointsDebutPhase1 = innerContent[3].find('small').text.strip()
            progressionMensuelle = innerContent[4].find('small').text.strip()
            progressionGenerale = innerContent[5].find('small').text.strip()
        else:
            pointsDebutPhase = None
            pointsDebutPhase1 = None
            progressionMensuelle = None
            progressionGenerale = None

        return {
            'licence': licenceId,
            'typeLicence': typeLicence,
            'sex': 'F' if sex == 'female' else 'H',
            'name': name,
            'categorie': categorie,
            'pointsDebutPhase': pointsDebutPhase,
            'pointsMensuels': pointsMensuels,
            'progressionMensuelle': progressionMensuelle,
            'progressionGenerale': progressionGenerale
        }
            

    @staticmethod
    def _api_call(url):
        print(url)
        response = requests.get('https://www.pingpocket.fr/app/fftt/' + url, 
                                headers={"X-Requested-With":"XMLHttpRequest"})

        if response.status_code == 200:
            return BeautifulSoup(response.text, 'html.parser')
        else:
            print(f"Erreur lors de la récupération de la page : {response.status_code}")

if __name__ == '__main__':
    PingPocketQuery().run()