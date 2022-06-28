# Purpose 

Experiment discord module from Node.js and see its features. Creating your own bot allows you to choose whatever you want for options and can be a huge help for managing servers with large amount of people. It is simple to add to your server with [Discord Developper Portal](https://discord.com/developers/applications) that provides advices for bot installation.

# Current version

Since it's the beginning of the project, there is almost no interaction with the bot.

Here is a list of available commands :
- **ping**
    - use `/ping` for an answer from the bot
- **info**
    - use `/info server` to see info from the server where the bot is
    - use `/info user` to see info for the choosen user
- **gif**
    - use `/gif` + word for bot replying with a gif relying to the given word
- **role**
    - use `/role create` to create a new role (only member with Administrator role can use it)
    - use `/role delete` to delete existing role (only member with Administrator role can use it)
    - use `/role view`   to list all roles in the server except `@everyone`
- **setrole**
    - use `/setrole set` to set a role for user (only member with Administrator role can use it)
    - use `/setrole remove` to remove a role from user (only member with Administrator role can use it)
- **permission**
    - use `/permission add` to add permission(s) to a role, the role is given by an input and the permission(s) by choice list


Few interactions :
- "quoi" : the bot will answer with "feur" (french joke : quoi and feur together sounds like "coiffeur")
- "oui" : the bot will answer with "stiti" (also french joke)
- Each minute the bot will post a message
- One time per day the bot will post a message