import os
from dotenv import load_dotenv
from openai import OpenAI
load_dotenv()

client = OpenAI(
    api_key = os.getenv('OPENAI_API_KEY')
)

def analyze_fantasy_trade(team_a_players, team_b_players):
    if not isinstance(team_a_players, list) or not isinstance(team_b_players, list):
        raise ValueError("Both team_a_players and team_b_players should be lists")

    team_a_string = ', '.join(team_a_players)
    team_b_string = ', '.join(team_b_players)

    trade_analysis_query = f"Analyze the following fantasy football trade. Team A is trading {team_a_string} to Team B for {team_b_string}. Provide a detailed analysis of how this trade would impact both teams for the rest of the fantasy season, in a full PPR league. Predict the winner of the trade, irrespective of the unknown rest of lineups"

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant analyzing fantasy football trades."},
            {"role": "user", "content": trade_analysis_query},
        ],
        temperature=0.7
    )

    responses = [choice.message.content for choice in response.choices]
    return responses