import React, { useState } from 'react';
import { Choice } from '../../types'
import { sendMessage } from '../../network/controllers/aiAssistant'
import { CHAT_TITLE, CHAT_WELCOME_MESSAGE } from '../../constants/strings'
import SendIcon from '@mui/icons-material/Send';
import MessageIcon from '@mui/icons-material/Message';
import './ChatWidget.css'


export interface ChatWidgetProps {
  onChange: Function
}

export const ChatWidget = ({ onChange }: ChatWidgetProps) => {
  const [active, setActive] = useState(false)
  const [messages, setMessages] = useState<Choice[]>([])
  const [userMessage, setUserMessage] = useState('')
  const [isWriting, setIswriting] = useState(false)

  const handleSend = async () => {
    console.log(active, messages, isWriting)
    setUserMessage('')
    setMessages((choices: Choice[]) => [...choices, { message: { content: userMessage, role: 'user' } }])
    setIswriting(true)

    const data = await sendMessage(userMessage)

    const choices = data.getChoices()

    setIswriting(false)
    setMessages((oldChoices: Choice[]) => [...oldChoices, ...choices])

    onChange(choices[0]?.message.content)
  }

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === 'Enter') {
      handleSend()
    }
  }
  return (
    active ?
      <div id={'container'}>
        <div id='header' onClick={() => setActive(false)}>
          <div>
            <div style={{ fontSize: 22 }}>{CHAT_TITLE}</div>
            <div style={{ fontSize: 12, textAlign: 'center' }}>Type your dish name</div>
          </div>
        </div>
        <div id='conversationBox' >
          <div id='dialogBox'>
            {CHAT_WELCOME_MESSAGE}
          </div>
          {messages?.map((item: Choice, index: number) => {
            if (item.message.role === "assistant") {
              return <div id='dialogBox' key={index}>{item.message.content}</div>
            } else {
              return <div id='leftDialogBoxContainer' key={index}>
                <div id='dialogBox'>
                  {item.message.content}
                </div>
              </div>
            }
          })}
          {isWriting && <div id='AIIsWriting'>AI assistant is writing.....</div>}
        </div>
        <div id='messageBox'>
          <input placeholder='Type only name of the dish'
            onChange={(input) => setUserMessage(input.target.value)}
            value={userMessage}
            onKeyUp={handleKeyPress}
          />
          <div onClick={handleSend}> <SendIcon />
          </div>
        </div>
      </div>
      : <div id='inActiveChatcontainer' onClick={() => setActive(true)}>
        <div id='inActiveChatHint'>Need help finding the ingredients? <div id='hintArrow' /></div>
        <div id='inActiveChatcontainerButton'>
          <MessageIcon />
        </div>
      </div>
  )
}
