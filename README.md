Install the package

```
npm i ai-chat-cooking-assistant
```
```
Create assistant-configs.json file in your public directory and paste the following:
{
    "APP_KEY": "",
    "APP_ID": ""
}

You should find these info in your dashboard.
```

Import these 2 files into your page: 
```
import 'ai-chat-cooking-assistant/dist/bundle.css'
import {ChatWidget} from 'ai-chat-cooking-assistant'
```
Call the widget in your JSX:
```
 <ChatWidget onChange={()=> {}} />
```
You are ready to go!