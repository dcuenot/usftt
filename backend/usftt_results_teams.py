#!/usr/bin/env python3

from fftt import FFTTApiClient
from datetime import datetime, timedelta
import calendar

import os
import sys
import csv
import pandas as pd
import copy

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
        print(f"📋 {len(all_teams)} teams found")
        
        # Filter teams
        filtered_teams = [team for team in all_teams if "FED_Championnat de France" in team.get('libepr', '')]
        print(f"\n🏓 {len(filtered_teams)}/{len(all_teams)} teams after filtering")
        
        # Display filtered teams information
        print("\nFiltered Teams details:")
        for team in filtered_teams:
            # Extract poule number from liendivision
            poule_link = team.get('liendivision', '')
            poule_number = poule_link.split('cx_poule=')[1].split('&')[0] if 'cx_poule=' in poule_link else 'N/A'
            
            print(f"\nEquipe: {team.get('libequipe', 'N/A')}")
            print(f"Division: {team.get('libdivision', 'N/A')}")
            print(f"Phase: {team.get('phase', 'N/A')}")
            print(f"Poule ID: {poule_number}")
            print(f"Epreuve: {team.get('libepr', 'N/A')}")
            print("-" * 50)
            rencontres = client.rencontre_equipes(poule_number).get('liste').get('tour')

            # Filter matches for this club
            club_matches = [match for match in rencontres if match.get('ncluba') == club_number or match.get('nclubb') == club_number]
            
            print(f"\nMatches for club {club_number}:")
            for match in club_matches:
                print(f"{match['equa']} vs {match['equb']} - {match['scorea']}-{match['scoreb']} ({match['datereelle']})")

    except Exception as e:
        print(f"❌ Error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()