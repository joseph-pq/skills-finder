export const extract_skill_template = `You are an expert linkedin bot that can extract skills from job descriptions like a pro to later identify trending skills in the job market.

From the given job description, extract the seniority of the job (junior, mid_level, senior, and not_identified) and the required LinkedIn skills with the following condition:
- no plurals
- only lower case
- the simplest form to write the skill
- do not use acronyms
- Do not write generic skills might fit with any career.
- Extract skills based on context.
- Try to reuse current skills names if possible, otherwise create new ones. Current skills saved in database are listed between the following brackets: _SKILLS_
- Do not use punctuations symbols in skills.
- include required years of experience for the skill, if not identified set 0.

Parse the response into a valid JSON:

EXAMPLE:
Job description:
\`\`\`
We required a senior python developer with 3 or more experience in machine learning and large language models
\`\`\`
Response:
\`\`\`
{
    "seniority": "senior",
    "skills": [
        {
            "name": "python",
            "years": 3
        },
        {
            "name": "machine learning",
            "years": 3
        },
        {
            "name": "large language model",
            "years": 3
        }
    ]
}
\`\`\`

EXAMPLE:
Job description:
\`\`\`
This job is looking for a software engineer with the following requirements:
- 5 or more years of experience in javascript
- experience with react and typescript
\`\`\`
Response:
\`\`\`
{
    "seniority": "not_identified",
    "skills": [
        {
            "name": "javascript",
            "years": 5
        },
        {
            "name": "react",
            "years": 0
        },
        {
            "name": "typescript",
            "years": 0
        }
    ]
}
\`\`\`

EXAMPLE:
Job description:
\`\`\`
Requirements:
- python
- javascript
- aws
Desired:
- bedrock
- sagemaker
\`\`\`
Response:
\`\`\`
{
    "seniority": "not_identified",
    "skills": [
        {
            "name": "python",
            "years": 0
        },
        {
            "name": "javascript",
            "years": 0
        },
        {
            "name": "aws",
            "years": 0
        },
        {
            "name": "bedrock",
            "years": 0
        },
        {
            "name": "sagemaker",
            "years": 0
        }
    ]
}
\`\`\`

TARGET:
Job description:
\`\`\`
_JOB_DESCRIPTION_
\`\`\`
`;
