#!/usr/bin/env python3

from fftt import FFTTApiClient
import os
import json
import sys
import csv
from datetime import datetime

def save_to_csv(players, club_number):
    """Save players data to a CSV file."""
    # Create filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"players_{club_number}_{timestamp}.csv"
    
    # Get field names from the first player entry
    if not players:
        return
    
    fieldnames = list(players[0].keys())
    
    # Write to CSV file
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(players)
    
    print(f"📝 Data saved to {filename}")

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
        list_joueurs_club = client.list_joueurs_club(club_number)
        print(json.dumps(list_joueurs_club, indent=2, ensure_ascii=False))

        joueurs = list_joueurs_club.get('liste').get('joueur')
        filtered_joueurs = []
        
        print("\n🔍 Fetching detailed information for each player...")
        for j in joueurs:
            basic_info = {
                'licence': j['licence'],
                'prenom': j['prenom'],
                'nom': j['nom']
            }
            
            try:
                # Get detailed information for each player
                details = client.joueur_detail(j['licence'])
                player_details = details.get('liste', {}).get('joueur', {})
                
                # Update only specific fields from details
                if player_details:
                    basic_info.update({
                        'categ': player_details.get('categ'),
                        'natio': player_details.get('natio'),
                        'point': player_details.get('point'),
                        'aclglob': player_details.get('aclglob'),
                        'apoint': player_details.get('apoint'),
                        'valcla': player_details.get('valcla'),
                        'valinit': player_details.get('valinit')
                    })
                filtered_joueurs.append(basic_info)
                print(f"✅ Retrieved details for {j['prenom']} {j['nom']}")
            except Exception as e:
                print(f"⚠️  Failed to get details for {j['prenom']} {j['nom']}: {e}")
                filtered_joueurs.append(basic_info)
        
        print(f"\n🏓 {len(filtered_joueurs)} joueurs trouvés:")
        print(json.dumps(filtered_joueurs, indent=2, ensure_ascii=False))
        
        # Save to CSV file
        save_to_csv(filtered_joueurs, club_number)

    except Exception as e:
        print(f"❌ Error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()