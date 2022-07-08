# Purpose 

Experiment discord module from Node.js and see its features. Creating your own bot allows you to choose whatever you want for options and can be a huge help for managing servers with large amount of people. It is simple to add to your server with [Discord Developper Portal](https://discord.com/developers/applications) that provides advices for bot installation.

# Features

There are few possible interactions with the bot like commands or sending special messages.

Here is a table of slash commands available :
|**Name**|**Description**|
|--|--|
|ping|makes the bot answer to it|
|info|use `server` to see info from the server where the bot is<br>use `user` to see info for the choosen user|
|role|use `create` to create a new role (only member with Administrator role can use it)<br>use `delete` to delete existing role (only member with Administrator role can use it)<br>use `view` to view all permissions of a role, an input is required for its name<br>use `list` to list all roles in the server except `@everyone`|
|setrole|use `set` to set a role for user (only member with Administrator role can use it)<br>use `remove` to remove a role from user (only member with Administrator role can use it)|
|permision|use `add` to add permission(s) to a role, the role is given by an input and the permission(s) by choice list<br>use `remove` to remove permission(s) to a role, the role is given by an input and the permission(s) by choice list|
|warn|use `user` and `reason` to warn an user, the warning (count and reason) and the user's name will be saved in JSON file, for the time the outcome is not decided which results as an infinite warning as long as possible|

It's possible to "create" special commands by user sending message with a special character followed by command name.</br>
Here is a table of special commands using character `$` :
|**Name**|**Description**|
|--|--|
|wiki|give a language and term to enable bot creating Wikipedia link|
|weather|give a city name to see its temperature felt (space characters are managed)|
|translate|give a language as entry and another as destination and your message to see it translated (space characters are managed)|
|commandlist|give a list of all commands except itself|

And below a table with special interaction/behaviour of the bot :
|**Message**|**Interaction**|
|--|--|
|"quoi"|the bot will answer with "feur" (french joke : quoi and feur together sounds like "coiffeur")|
|"oui"|the bot will answer with "stiti" (also french joke)|
|&#x274C;|Each minute the bot will post a message|
|&#x274C;|Once per day the bot will post a message|
