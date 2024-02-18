# Using openAI language model API to gather some roster feeback.

import os
from dotenv import load_dotenv
from openai import OpenAI
load_dotenv()

client = OpenAI(
    api_key = os.getenv('OPENAI_API_KEY')
)

def get_openai_response(player_names):

    if not isinstance(player_names, list):
        player_names = [player_names]

    player_names_string = ', '.join(player_names)

    response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant for a fantasy american football league."},
        {"role": "user", "content": player_names_string},
        {"role": "user", "content": "1. Strengths and Weaknesses Analysis: Examine the team's performance from a fantasy sports perspective. Identify and briefly explain two key strengths and two key weaknesses of the team. 2. Handcuff Options: Evaluate the roster in terms of the 'handcuffing' strategy with up-to-date 2024 rosters. Suggest potential player pickups that could be beneficial and name a player who could be dropped to accommodate these new additions. 3. Based on a detailed statistical analysis of the team's roster, performance history, and potential in a full PPR league, assign a percentage grade (0-100%). The grade should reflect a comprehensive assessment, considering the team's depth, injury history, player consistency, and overall scoring potential. Please ensure the grade varies according to the specific characteristics and statistical strengths and weaknesses of each team."},
    ],
    temperature=0.7
    )

    responses = [choice.message.content for choice in response.choices]
    return responses
