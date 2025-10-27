#!/usr/bin/env python3

from fftt import FFTTApiClient
from datetime import datetime, timedelta
import calendar

import os
import sys
import csv
import pandas as pd
import copy
import re

def normalize_division(libdivision):
    """Normalize division names to standardized format."""
    # Handle federal division names (N1, N2, N3, etc.)
    if 'FED_Nationale' in libdivision:
        match = re.search(r'Nationale (\d)', libdivision)
        if match:
            return f"N{match.group(1)}"
            
    # Handle regional divisions (R1, R2, R3, etc.)
    if 'L08_R' in libdivision:
        match = re.search(r'R(\d)', libdivision)
        if match:
            return f"R{match.group(1)}"
            
    # Handle Pre-Regional division
    if 'Pre-Reg.' in libdivision or libdivision.strip().startswith('PR'):
        return "PR"
    
    # Handle Pre-Regional division
    if 'PN' in libdivision or libdivision.strip().startswith('PN'):
        return "PN"
        
    # Handle departmental divisions (D1, D2, D3, D4, etc.)
    match = re.search(r'D(\d)\s+(?:Masculine|Feminine)', libdivision)
    if match:
        return f"D{match.group(1)}"
        
    # Default: return the original division name
    return libdivision

def extract_team_id(libequipe, libdivision):
    """Extract team ID based on team name and division."""
    # Extract team number from libequipe (e.g., "US FONTENAY TT 3 - Phase 1" -> "3")
    team_number = next((char for char in libequipe.split() if char.isdigit()), None)
    
    # Determine gender marker based on division
    gender_marker = 'F' if 'Dames' in libdivision else 'G'
    
    # Combine into ID
    return f"{team_number}{gender_marker}" if team_number else None

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

    try:
        # Get list joueurs du club
        print("📍 Fetching list joueurs du club...")
        all_teams = client.equipes_club(club_number).get('liste').get('equipe')
        
        # Filter teams with "FED_Championnat de France" in epreuve
        filtered_teams = [team for team in all_teams if "FED_Championnat de France" in team.get('libepr', '')]
        
        output = []
        for team in filtered_teams:
            # Extract poule number from liendivision
            poule_link = team.get('liendivision', '')
            poule_number = poule_link.split('cx_poule=')[1].split('&')[0] if 'cx_poule=' in poule_link else 'N/A'
            
            output.append({
                "id": extract_team_id(team.get('libequipe', ''), team.get('libdivision', '')),
                "equipe": team.get('libequipe', 'N/A'),
                "division": team.get('libdivision', 'N/A'),
                "rencontres": []
            })

            rencontres = client.rencontre_equipes(poule_number).get('liste').get('tour')

            # Filter matches for this club
            club_matches = [match for match in rencontres if match.get('ncluba') == club_number or match.get('nclubb') == club_number]
            
            for match in club_matches:
                # Extract tour number from libelle
                tour_number = match['libelle'].split('tour n°')[1].split(' ')[0]
                
                # Create match data
                match_data = {
                    "tour": tour_number,
                    "date": match['datereelle'],
                    "equipe_domicile": match['equa'],
                    "equipe_exterieur": match['equb'],
                    "score_domicile": match['scorea'],
                    "score_exterieur": match['scoreb'],
                    "is_home": match['ncluba'] == club_number
                }
                
                # Append match to the current team's rencontres
                output[-1]["rencontres"].append(match_data)
                
            # Sort matches by tour number
            output[-1]["rencontres"].sort(key=lambda x: int(x["tour"]))

        # Prepare data for CSV
        csv_data = []
        for team in output:
            for match in team['rencontres']:
                csv_data.append({
                    'team_id': team['id'],
                    'team_name': team['equipe'],
                    'division': normalize_division(team['division']),
                    'tour': match['tour'],
                    'date': match['date'],
                    'equipe_domicile': match['equipe_domicile'],
                    'equipe_exterieur': match['equipe_exterieur'],
                    'score_domicile': match['score_domicile'] or '',  # Handle None values
                    'score_exterieur': match['score_exterieur'] or '',  # Handle None values
                    'is_home': match['is_home']
                })

        # Write to CSV
        csv_filename = 'rencontres_'+club_number+'.csv'
        fieldnames = ['team_id', 'team_name', 'division', 'tour', 'date', 
                     'equipe_domicile', 'equipe_exterieur', 'score_domicile', 
                     'score_exterieur', 'is_home']
        
        with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(csv_data)
            
        print(f"\n✅ Data written to {csv_filename}")

    except Exception as e:
        print(f"❌ Error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()