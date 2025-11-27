
a gitthub workflow should have the following walkthrough:

1. the gitthub workflow skill should is invoked with a online prompt such as:
		"i want to create a gitthub workflow for prototyping a website based on reference material"
	the agent will use this information for the description of the  workflow
	
2. the agent will decide what type of workflow the user wants to create: navigate, educate, or deploy
		-> in this case deploy

3. the user is asked sequentially after
	1. his proficiency in computer use (difficulty)
	2. the reference material (references), either as filepath or as attachments
	3. 2-3 lines of context to explain the task and the reference material (context)

5. the agent then goes on and thinks about what additional information he needs, now he has the proficiency, references and context. he then invokes either sequentially 3-4 questions or using the askusertool (claude code).

6. the agent then goes on and formulates a draft outline of the workflow and presents it to the user so the user can get another shot at finalizing it or adding information.

7. the agent finalizes the workflow: it formulates the steps and instructions, sorts at which step which reference material will be used for what prompt and what skills might be useful to create using the skill-creator-skill. e.g. for a website with reference material it could be useful to have a skill for creating react pages and a skill for style guidelines. other usecases might need skills for database extraction, data collection, research, data visualisation, writing-style-guides and so on.

8. the workflow is then printed as markdown, using the given format for a workflow document

