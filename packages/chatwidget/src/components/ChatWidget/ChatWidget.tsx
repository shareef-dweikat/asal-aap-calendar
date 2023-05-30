import React, { useEffect, useState, useRef, LegacyRef } from 'react';
import { Choice } from '../../types'
import { sendMessage } from '../../network/controllers/aiAssistant'
import { CHAT_TITLE, CHAT_WELCOME_MESSAGE } from '../../constants/strings'
import SendIcon from '@mui/icons-material/Send';
import MessageIcon from '@mui/icons-material/Message';
import './ChatWidget.css'
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

export interface ChatWidgetProps {
  onChange: Function
  foundProducts: [{ name: string }]
}

export const ChatWidget = ({ onChange, foundProducts }: ChatWidgetProps) => {
  const [active, setActive] = useState(false)
  const [messages, setMessages] = useState<Choice[]>([])
  const [userMessage, setUserMessage] = useState('')
  const [isWriting, setIswriting] = useState(false)
  const [appInfo, setAppInfo] = useState<{ APP_ID: string, APP_KEY: string }>({ APP_ID: '', APP_KEY: '' })

  const spacerRef = useRef(null)

  useEffect(() => {
    spacerRef?.current?.scrollIntoView()
  }, [messages])

  useEffect(() => {
    const getConfigs = async () => {
      const configs = await fetch('../../../assistant-configs.json')
      return configs.json();
    }
    getConfigs().then((res) => {
      setAppInfo(res)
    })
  }, [])

  const handleSend = async () => {
    const userMessageWithoutSpaces = userMessage?.replace(/\s/g, '')
    if (userMessageWithoutSpaces?.replace(/\s/g, '') === '') return

    setUserMessage('')
    setMessages((choices: Choice[]) => [...choices, { message: { content: userMessage, role: 'user' } }])
    setIswriting(true)

    const data = await sendMessage(userMessage, appInfo)

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

  const isProductFound = (item: string) => {
    const falg = foundProducts?.filter((product) => product.name.toLocaleLowerCase().trim() === item.toLocaleLowerCase().trim())
    const isfound = falg.length == 0
    return isfound
  }

  const getAssistantMessage = (item, index) => {
    return <div id='dialogBox' key={index}>
      {item.message.content?.replace(/['"]+/g, '').split(',').map((item, index) =>
        <div className={`ingredientTag ${isProductFound(item) ? 'redTag' : 'greenTag'}`}>
          {isProductFound(item) ? <CloseIcon fontSize="small" /> : <DoneIcon fontSize="small" />} {item}
        </div>)}
    </div>
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
              return getAssistantMessage(item, index)
            } else {
              return <div id='leftDialogBoxContainer' key={index}>
                <div id='dialogBox'>
                  {item.message.content}
                </div>
              </div>
            }
          })}
          <div ref={spacerRef} id='spacer' />
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
