# Welcome to the gitthub documentation

gitthub.org is a platform for organizing how you work with AI agents. It provides a structured approach to creating, storing, and editing the instructions that guide AI assistants through complex tasks. Read through this executive summary before jumping right in via one of the three options in the getting started section on the left.

The core problem gitthub solves: **AI agents are powerful but its not obvious or trivial how to use them**. With organized instructions, you have an ex ante plan that modularizes the steps necessary to achive a goal.

Assuming you have something in mind to create, it is always good advice to shortly step back and think about what this might depend on, and how to best go about it. gitthub offers a conceptualization of how to instruct an ai agent properly and gives you a system to make AI collaboration repeatable and improvable.

For example, have a look at the diverse set of use cases anthropic offers on its page: https://claude.com/resources/use-cases.

With gitthub.org you have a format to save, edit and flexibly execute these use cases just via your browser using Claude. 

**At its core, gitthub is an instructions generator and display mode, that lets you follow along the jumps you can make using ai and harness them:**


<div style="border: 2px solid #8a3ffc; border-radius: 8px; overflow: hidden; max-width: 500px; margin: 16px auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <div style="background: #8a3ffc; color: white; padding: 8px 12px; font-weight: 600; font-family: system-ui, sans-serif;">
    view / execute mode
  </div>
  <img src="/images/docs-screenshot.png" alt="Execute view showing workflow instructions" style="width: 100%; display: block;" />
</div>

The screenshot above shows the view/execute mode in the hub page. Its gitthubs cockpit for running manually through workflows for either creating something that needs many context inputs or for working out the best approach to reach something. 


You can use gitthub in many ways and for anything that can be digitally processed, but here is one core flow:


![Getting Started with gitthub - 4 step flow from Create to Document](/images/gitthub-getting-started-flow.svg)


1) create a new workflow using the gitthub skill in e.g. claude or claude code, it will guide you through a conversation that ends with a workflow you can review and then print as markdown.
2) go to the gitthub.org docs page, select the workflow section and upload your workflow to the database. You can also have a further look at the summary of the steps and the source documents if you want to make small manual changes.
3) now go to the hub page and display the individual instructions to follow along steer, optimize or add skills, mcps or subagents. Note: you can obviously also create a gitthub workflow for creating another skill, mcp server, or subagent specifically for your task.
4) once your are happy with the execution or the state of a workflow you can organize it in a project.

gitthub is organized into two main areas: **Docs** and **Hub**.
<div style="display: flex; gap: 24px; margin: 24px 0;">
  <div style="flex: 1;">
    <img src="/images/gitthub-docs-structure.svg" alt="Docs page structure" style="width: 100%;" />
  </div>
  <div style="flex: 1;">
    <img src="/images/gitthub-hub-structure.svg" alt="Hub page structure" style="width: 100%;" />
  </div>
</div>

### Docs

This is where you currently are. Learn the concepts and patterns behind effective AI collaboration.

Use the dropdown in the top left corner that currently says README to explore the four building blocks:
- **Workflows** - Step-by-step guides for humans and AI to execute together
- **Skills** - Reusable instructions that give AI consistent behavior
- **MCP Servers** - Connections between AI and external tools
- **Subagents** - Specialized AI workers for delegating tasks

### Hub

Your personal workspace for putting gitthub into practice.

- **Browse** the content library - discover workflows, skills, and MCP configurations
- **Organize** your projects - group related workflows and skills together
- **Build** your toolkit - save and customize the resources that work for you

Think of Docs as the manual, and Hub as your workbench.

**Now have a look at the getting started window in the navigation pane on the left. Jump right in if you finally wanna try it and click on step 2 to kick start!**