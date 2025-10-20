#!/usr/bin/env python3

from fftt import FFTTApiClient
import os
import json
import sys
import csv
from datetime import datetime

def save_licenses_to_csv(licenses, club_number):
    """Save licenses data to a CSV file."""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"licenses_{club_number}_{timestamp}.csv"
    
    if not licenses:
        return
    
    # Add 'parties' to fieldnames
    fieldnames = [
        'licence', 'nom', 'prenom', 'sexe', 'certif', 'type', 'validation', 
        'cat', 'point', 'pointm', 'apointm', 'initm', 'mutation', 'arb', 'ja', 'tech',
        'parties'
    ]
    
    # Write to CSV file
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for license in licenses:
            # Extract only the fields we want
            row = {
                'licence': license.get('licence'),
                'nom': license.get('nom'),
                'prenom': license.get('prenom'),
                'sexe': license.get('sexe'),
                'certif': license.get('certif'),
                'type': license.get('type'),
                'validation': license.get('validation'),
                'cat': license.get('cat'),
                'point': license.get('point'),
                'pointm': license.get('pointm'),
                'apointm': license.get('apointm'),
                'initm': license.get('initm'),
                'mutation': license.get('mutation'),
                'arb': license.get('arb'),
                'ja': license.get('ja'),
                'tech': license.get('tech'),
                'parties': license.get('parties', 0)  # Add parties field
            }
            writer.writerow(row)
    
    print(f"📝 Licenses saved to {filename}")

def main():
    """Fetch and display USFTT club details and teams."""
    # Initialize FFTT client
    try:
        client = FFTTApiClient(
            app_id=os.environ['FFTT_APP_ID'],
            password=os.environ['FFTT_PASSWORD'],
            serie=os.environ.get('FFTT_SERIE')
        )
    except KeyError:
        print("❌ Environment variables FFTT_APP_ID and FFTT_PASSWORD are required")
        sys.exit(1)

    # USFTT club number
    club_number = "08940073"
    #club_number = "02210081"

    try:
        # Get list joueurs du club
        print("📍 Fetching list joueurs du club...")
        list_joueurs_club = client.licences_club(club_number)
        
        # Filter licenses to keep only type 'T' (competitive)
        all_licenses = list_joueurs_club.get('liste').get('licence')
        licenses = [lic for lic in all_licenses if lic.get('type') == 'T']
        print(f"\n🏓 {len(licenses)}/{len(all_licenses)} licenses trouvées (type T)")
        

        print(client.parties_joueur('9452997').get('liste') == '\n')
        # Add number of matches played for each license
        print("\n📊 Fetching matches played for each license...")
        for license in licenses:
            license['parties'] = nb_parties_jouees(client, license['licence'])
            print(f"✅ {license['prenom']} {license['nom']}: {license['parties']} matches")
        
        # Save licenses to CSV
        save_licenses_to_csv(licenses, club_number)

    except Exception as e:
        print(f"❌ Error occurred: {e}")
        sys.exit(1)

def nb_parties_jouees(client: FFTTApiClient, licence: str):
    list_parties_joueur = client.parties_joueur(licence).get('liste')
    if list_parties_joueur == '\n' or not list_parties_joueur.get('partie'):
        return 0
        
    # Get current month and year
    current_date = datetime.now()
    current_month = current_date.month
    current_year = current_date.year
        
    # Filter out matches from current month
    filtered_matches = [
        match for match in list_parties_joueur.get('partie')
        if (
            (parsed_date := datetime.strptime(match['date'], '%d/%m/%Y')).month != current_month
            or parsed_date.year != current_year
        )
    ]
    
    return len(filtered_matches)

if __name__ == "__main__":
    main()