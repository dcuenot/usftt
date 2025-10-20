#!/usr/bin/env python3

from fftt import FFTTApiClient
from datetime import datetime, timedelta
import calendar

import os
import sys
import csv
import pandas as pd
import copy

def get_month(nb: int) -> str:
    """Get the name of the previous month in French."""
    today = datetime.now()
    first = today.replace(day=1)
    approx_last_month = first + timedelta(days=nb * 30)
    return approx_last_month.strftime("%b")

def save_to_csv(data, filename, fieldnames):
    """Generic function to save data to CSV with merging capability."""
    # Convert new data to DataFrame
    new_df = pd.DataFrame(data)
    
    try:
        # Try to read existing CSV file
        existing_df = pd.read_csv(filename)
        
        # Convert numeric columns to string to ensure consistent handling
        numeric_cols = ['idlicence', 'licence']
        for col in numeric_cols:
            if col in new_df.columns:
                new_df[col] = new_df[col].astype(str)
            if col in existing_df.columns:
                existing_df[col] = existing_df[col].astype(str)
        
        # Merge DataFrames using licence as index, update only new values
        merged_df = existing_df.set_index('idlicence').combine_first(
            new_df.set_index('idlicence')
        ).reset_index()
    except FileNotFoundError:
        merged_df = new_df
        # Convert numeric columns to string for new data
        for col in ['idlicence', 'licence']:
            if col in merged_df.columns:
                merged_df[col] = merged_df[col].astype(str)
    
    # Ensure all required columns are present
    for col in fieldnames:
        if col not in merged_df.columns:
            merged_df[col] = ''
    
    # Sort by idlicence before saving (treat as identifier string, not numeric)
    merged_df.sort_values(by='idlicence', key=lambda x: x.astype(int), inplace=True)
    
    # Save to CSV
    merged_df.to_csv(filename, index=False)
    return len(merged_df)

def save_competitors_to_csv(competitors, club_number):
    """Save competitors data to a CSV file."""
    if not competitors:
        return
    
    filename = f"competitors_{club_number}.csv"
    fieldnames = [
        'idlicence', 'licence', 'sexe', 'cat', 'prenom', 'nom', 'point',
         'parties', get_month(-1), get_month(-2)
    ]
    
    count = save_to_csv(competitors, filename, fieldnames)
    print(f"📝 {count} competitors saved to {filename}")

def save_licenses_to_csv(licenses, club_number):
    """Save licenses data to a CSV file."""
    if not licenses:
        return
    
    # Work on a deep clone so we don't mutate the original licenses list
    licenses_clone = copy.deepcopy(licenses)

    filename = f"licenses_{club_number}.csv"
    fieldnames = [
        'idlicence', 'licence', 'sexe', 'cat', 'prenom', 'nom', 'certif',
         'type', 'validation', 'mutation', 'arb', 'ja', 'tech'
    ]

    for license in licenses_clone:
        for k in ('numclub', 'nomclub', 'echelon', 'place', 'point', 'pointm', 'apointm', 'initm', 'natio'):
            license.pop(k, None)

    print("\n💾 Saving all licenses to CSV...")
    count = save_to_csv(licenses_clone, filename, fieldnames)
    print(f"📝 {count} licenses saved to {filename}")

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
        all_licenses = client.licences_club(club_number).get('liste').get('licence')
        save_licenses_to_csv(all_licenses, club_number)
        
        # Filter licenses to keep only type 'T' (competitive)
        competitors = [lic for lic in all_licenses if lic.get('type') == 'T']
        print(f"\n🏓 {len(competitors)}/{len(all_licenses)} competitors found (type T)")
        
        # Add number of matches played for each license
        print("\n📊 Fetching matches played for each competitor...")
        for competitor in competitors:
            for k in ('numclub', 'nomclub', 'type', 'certif', 'validation', 'echelon', 'place', 'mutation', 'natio', 'arb', 'ja', 'tech'): competitor.pop(k, None)
            competitor['parties'] = nb_parties_jouees(client, competitor['licence'])
            competitor[get_month(-1)] = competitor.pop("pointm")
            competitor[get_month(-2)] = competitor.pop("apointm")

        # Save competitors to CSV
        save_competitors_to_csv(competitors, club_number)

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