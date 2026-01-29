#!/usr/bin/env python3

import pytest
import sys
import os
from unittest.mock import Mock, MagicMock

# Add parent directory to path to import the module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from usftt_results_teams import normalize_division, extract_team_id, get_team_ranking


class TestNormalizeDivision:
    """Test cases for normalize_division function."""

    def test_federal_nationale_1(self):
        """Test normalization of Nationale 1 division."""
        assert normalize_division("FED_Nationale 1") == "N1"

    def test_federal_nationale_2(self):
        """Test normalization of Nationale 2 division."""
        assert normalize_division("FED_Nationale 2") == "N2"

    def test_federal_nationale_3(self):
        """Test normalization of Nationale 3 division."""
        assert normalize_division("FED_Nationale 3") == "N3"

    def test_regional_1(self):
        """Test normalization of Regional 1 division."""
        assert normalize_division("L08_R1 Poule A") == "R1"

    def test_regional_2(self):
        """Test normalization of Regional 2 division."""
        assert normalize_division("L08_R2 Poule B") == "R2"

    def test_regional_3(self):
        """Test normalization of Regional 3 division."""
        assert normalize_division("L08_R3 - Groupe Sud") == "R3"

    def test_pre_regional_with_prefix(self):
        """Test normalization of Pre-Regional division with prefix."""
        assert normalize_division("Pre-Reg. Poule A") == "PR"

    def test_pre_regional_starting_with_pr(self):
        """Test normalization of Pre-Regional division starting with PR."""
        assert normalize_division("PR Poule A") == "PR"
        assert normalize_division("PR  ") == "PR"

    def test_pre_national_with_pn(self):
        """Test normalization of Pre-National division with PN."""
        assert normalize_division("PN Poule A") == "PN"
        assert normalize_division("PN  ") == "PN"

    def test_departmental_1_masculine(self):
        """Test normalization of Departmental 1 Masculine division."""
        assert normalize_division("D1 Masculine") == "D1"

    def test_departmental_2_feminine(self):
        """Test normalization of Departmental 2 Feminine division."""
        assert normalize_division("D2 Feminine") == "D2"

    def test_departmental_3_masculine(self):
        """Test normalization of Departmental 3 Masculine division."""
        assert normalize_division("D3 Masculine") == "D3"

    def test_departmental_4_feminine(self):
        """Test normalization of Departmental 4 Feminine division."""
        assert normalize_division("D4 Feminine") == "D4"

    def test_unknown_division(self):
        """Test that unknown divisions are returned unchanged."""
        unknown = "Some Unknown Division"
        assert normalize_division(unknown) == unknown

    def test_empty_string(self):
        """Test normalization of empty string."""
        assert normalize_division("") == ""

    def test_division_with_whitespace(self):
        """Test division names with extra whitespace."""
        assert normalize_division("  PR  ") == "PR"
        assert normalize_division("  PN  ") == "PN"


class TestExtractTeamId:
    """Test cases for extract_team_id function."""

    def test_extract_team_1_masculine(self):
        """Test extraction of team ID for team 1 masculine."""
        libequipe = "US FONTENAY TT 1 - Phase 1"
        libdivision = "R1 Masculine"
        assert extract_team_id(libequipe, libdivision) == "1G"

    def test_extract_team_2_masculine(self):
        """Test extraction of team ID for team 2 masculine."""
        libequipe = "US FONTENAY TT 2 - Phase 2"
        libdivision = "D1 Masculine"
        assert extract_team_id(libequipe, libdivision) == "2G"

    def test_extract_team_3_feminine(self):
        """Test extraction of team ID for team 3 feminine (Dames)."""
        libequipe = "US FONTENAY TT 3 - Phase 1"
        libdivision = "R1 Dames"
        assert extract_team_id(libequipe, libdivision) == "3F"

    def test_extract_team_4_masculine(self):
        """Test extraction of team ID for team 4 masculine."""
        libequipe = "US FONTENAY TT 4"
        libdivision = "D2 Masculine"
        assert extract_team_id(libequipe, libdivision) == "4G"

    def test_extract_team_10_masculine(self):
        """Test extraction of team ID for team 10 masculine (two-digit)."""
        libequipe = "US FONTENAY TT 10 - Phase 1"
        libdivision = "D3 Masculine"
        assert extract_team_id(libequipe, libdivision) == "10G"  # Extracts full team number

    def test_extract_team_feminine_division(self):
        """Test extraction with different variations of feminine division names."""
        libequipe = "US FONTENAY TT 5"
        assert extract_team_id(libequipe, "Dames Phase 1") == "5F"
        assert extract_team_id(libequipe, "R2 Dames") == "5F"
        assert extract_team_id(libequipe, "FED_Nationale 1 Dames") == "5F"

    def test_no_team_number_in_name(self):
        """Test when no team number is found in the name (before Phase)."""
        libequipe = "US FONTENAY TT - Phase 1"
        libdivision = "D1 Masculine"
        # Note: Currently extracts "1" from "Phase 1"
        assert extract_team_id(libequipe, libdivision) == "1G"

    def test_team_number_at_different_position(self):
        """Test team number at different positions in the name."""
        libequipe = "Club Name With 5 In Middle"
        libdivision = "D1 Masculine"
        assert extract_team_id(libequipe, libdivision) == "5G"

    def test_multiple_numbers_in_name(self):
        """Test that only the first number is extracted."""
        libequipe = "US FONTENAY 2 TT 3 - Phase 1"
        libdivision = "D1 Masculine"
        assert extract_team_id(libequipe, libdivision) == "2G"

    def test_empty_team_name(self):
        """Test with empty team name."""
        assert extract_team_id("", "D1 Masculine") is None

    def test_case_sensitivity_dames(self):
        """Test that 'Dames' detection is case-sensitive."""
        libequipe = "US FONTENAY TT 1"
        # Should be feminine
        assert extract_team_id(libequipe, "R1 Dames") == "1F"
        # Should be masculine (no 'Dames')
        assert extract_team_id(libequipe, "R1 dames") == "1G"
        assert extract_team_id(libequipe, "R1 DAMES") == "1G"


class TestGetTeamRanking:
    """Test cases for get_team_ranking function."""

    def test_get_ranking_single_team(self):
        """Test getting ranking for a single team in the list."""
        mock_client = Mock()
        mock_client.classement_poule.return_value = {
            'resultat': {
                'liste': {
                    'equipe': {
                        'libequipe': 'FONTENAY USTT 1',
                        'rang': '1',
                        'pts': '15',
                        'J': '5',
                        'V': '5',
                        'N': '0',
                        'D': '0',
                        'F': '0'
                    }
                }
            }
        }

        result = get_team_ranking(mock_client, '12345', 'FONTENAY USTT 1')

        assert result['rang'] == '1'
        assert result['points'] == '15'
        assert result['joues'] == '5'
        assert result['victoires'] == '5'
        assert result['nuls'] == '0'
        assert result['defaites'] == '0'
        assert result['forfaits'] == '0'

    def test_get_ranking_multiple_teams(self):
        """Test getting ranking when multiple teams are in the list."""
        mock_client = Mock()
        mock_client.classement_poule.return_value = {
            'resultat': {
                'liste': {
                    'equipe': [
                        {
                            'libequipe': 'TEAM A',
                            'rang': '1',
                            'pts': '20',
                            'J': '6',
                            'V': '6',
                            'N': '0',
                            'D': '0',
                            'F': '0'
                        },
                        {
                            'libequipe': 'FONTENAY USTT 2',
                            'rang': '3',
                            'pts': '10',
                            'J': '6',
                            'V': '3',
                            'N': '1',
                            'D': '2',
                            'F': '0'
                        },
                        {
                            'libequipe': 'TEAM C',
                            'rang': '5',
                            'pts': '5',
                            'J': '6',
                            'V': '1',
                            'N': '0',
                            'D': '5',
                            'F': '0'
                        }
                    ]
                }
            }
        }

        result = get_team_ranking(mock_client, '12345', 'FONTENAY USTT 2')

        assert result['rang'] == '3'
        assert result['points'] == '10'
        assert result['joues'] == '6'
        assert result['victoires'] == '3'
        assert result['nuls'] == '1'
        assert result['defaites'] == '2'

    def test_get_ranking_team_not_found(self):
        """Test when the team is not found in the ranking."""
        mock_client = Mock()
        mock_client.classement_poule.return_value = {
            'resultat': {
                'liste': {
                    'equipe': [
                        {
                            'libequipe': 'TEAM A',
                            'rang': '1',
                            'pts': '20',
                            'J': '6',
                            'V': '6',
                            'N': '0',
                            'D': '0',
                            'F': '0'
                        }
                    ]
                }
            }
        }

        result = get_team_ranking(mock_client, '12345', 'NONEXISTENT TEAM')

        assert result['rang'] == 'N/A'
        assert result['points'] == 'N/A'
        assert result['joues'] == '0'
        assert result['victoires'] == '0'

    def test_get_ranking_api_error(self):
        """Test handling of API errors."""
        mock_client = Mock()
        mock_client.classement_poule.side_effect = Exception("API Error")

        result = get_team_ranking(mock_client, '12345', 'FONTENAY USTT 1')

        assert result['rang'] == 'N/A'
        assert result['points'] == 'N/A'
        assert result['joues'] == '0'

    def test_get_ranking_missing_fields(self):
        """Test when some ranking fields are missing."""
        mock_client = Mock()
        mock_client.classement_poule.return_value = {
            'resultat': {
                'liste': {
                    'equipe': {
                        'libequipe': 'FONTENAY USTT 1',
                        'rang': '2',
                        'pts': '12'
                        # Missing J, V, N, D, F fields
                    }
                }
            }
        }

        result = get_team_ranking(mock_client, '12345', 'FONTENAY USTT 1')

        assert result['rang'] == '2'
        assert result['points'] == '12'
        assert result['joues'] == '0'
        assert result['victoires'] == '0'
        assert result['nuls'] == '0'
        assert result['defaites'] == '0'
        assert result['forfaits'] == '0'

    def test_get_ranking_empty_response(self):
        """Test when API returns empty or malformed response."""
        mock_client = Mock()
        mock_client.classement_poule.return_value = {}

        result = get_team_ranking(mock_client, '12345', 'FONTENAY USTT 1')

        assert result['rang'] == 'N/A'
        assert result['points'] == 'N/A'
