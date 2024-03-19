'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import Recorder from 'js-audio-recorder'
import type { FeedbackFunc, Feedbacktype } from './type'
import type { VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Tooltip from '@/app/components/base/tooltip'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import { XCircle } from '@/app/components/base/icons/solid/general'
import { Microphone01 } from '../base/icons/line/mediaAndDevices'
import { Microphone01 as Microphone01Solid } from '../base/icons/line/mediaAndDevices'
import VoiceInput from '@/app/components/base/voice-input'
import { useSession } from "next-auth/react"
import { LoginForm } from "@/app/login/form"
import { BindForm, get_user, check_user_valid, check_user_trying, BindButton } from '@/app/bind-sn/form'

export type IChatProps = {
  chatList: IChatItem[]
  /**
   * Whether to display the editing area and rating status
   */
  feedbackDisabled?: boolean
  /**
   * Whether to display the input area
   */
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponsing?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
}

export type IChatItem = {
  id: string
  content: string
  /**
   * Specific message type
   */
  isAnswer: boolean
  /**
   * The user feedback result of this message
   */
  feedback?: Feedbacktype
  /**
   * Whether to hide the feedback area
   */
  feedbackDisabled?: boolean
  isIntroduction?: boolean
  useCurrentUserAvatar?: boolean
  isOpeningStatement?: boolean
  message_files?: VisionFile[]
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponsing,
  controlClearQuery,
  visionConfig,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
  }

  const handleQueryChange = (e: string) => {
    const value = e
    setQuery(value)
  }

  const [voiceInputShow, setVoiceInputShow] = useState(false)
  const handleVoiceInputShow = () => {
    (Recorder as any).getPermission().then(() => {
      setVoiceInputShow(true)
    }, () => {
      logError(t('common.voiceInput.notAllow'))
    })
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    if (!query || query.trim() === '') {
      logError('Message cannot be empty')
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery)
      setQuery('')
  }, [controlClearQuery])
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend()))
      return
    onSend(query, files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    })))
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length)
        onClear()
      if (!isResponsing)
        setQuery('')
    }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current)
        handleSend()
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      setQuery(query.replace(/\n$/, ''))
      e.preventDefault()
    }
  }

  const { data: session, status } = useSession();
  if (status != "authenticated") {
    return <LoginForm />;
  }

  const user_info = session.user?.customData;
  // console.info("user_info:", user_info);
  const user_valid = check_user_valid(user_info);
  // console.log("user_valid: ", user_valid)
  const user_trying = check_user_trying(user_info);
  if (!user_valid) {
    return <BindForm />;
  }

  return (
    <div className={cn(!feedbackDisabled && 'px-3.5', 'h-full')}>
      {/* Chat List */}
      {user_trying && <BindButton />}
      <div className="h-full space-y-[30px]">
        {chatList.map((item) => {
          if (item.isAnswer) {
            const isLast = item.id === chatList[chatList.length - 1].id
            return <Answer
              key={item.id}
              item={item}
              onQueryChange={handleQueryChange}
              feedbackDisabled={feedbackDisabled}
              onFeedback={onFeedback}
              isResponsing={isResponsing && isLast}
            />
          }
          return (
            <Question
              key={item.id}
              id={item.id}
              content={item.content}
              useCurrentUserAvatar={useCurrentUserAvatar}
              imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(item => item.url) : []}
            />
          )
        })}
      </div>
      {
        !isHideSendInput && (
          <div className={cn(!feedbackDisabled && '!left-3.5 !right-3.5', 'absolute z-10 bottom-0 left-0 right-0')}>
            <div className='p-[5.5px] max-h-[150px] bg-white border-[1.5px] border-gray-200 rounded-xl overflow-y-auto'>
              {
                visionConfig?.enabled && (
                  <>
                    <div className='absolute bottom-2 left-2 flex items-center'>
                      <ChatImageUploader
                        settings={visionConfig}
                        onUpload={onUpload}
                        disabled={files.length >= visionConfig.number_limits}
                      />
                      <div className='mx-1 w-[1px] h-4 bg-black/5' />
                    </div>
                    <div className='pl-[52px]'>
                      <ImageList
                        list={files}
                        onRemove={onRemove}
                        onReUpload={onReUpload}
                        onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                        onImageLinkLoadError={onImageLinkLoadError}
                      />
                    </div>
                  </>
                )
              }
              <Textarea
                className={`
                  block w-full px-2 pr-[118px] py-[7px] leading-5 max-h-none text-sm text-gray-700 outline-none appearance-none resize-none
                  ${visionConfig?.enabled && 'pl-12'}
                `}
                value={query}
                onChange={handleContentChange}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                autoSize
              />
              <div className="absolute bottom-2 right-2 flex items-center h-8">
                <div className={`${s.count} h-5 leading-5 text-sm bg-gray-50 text-gray-500`}>{query.trim().length}</div>
                {
                  query
                    ? (
                      <div className='flex justify-center items-center ml-2 w-8 h-8 cursor-pointer hover:bg-gray-100 rounded-lg' onClick={() => setQuery('')}>
                        <XCircle className='w-4 h-4 text-[#98A2B3]' />
                      </div>
                    )
                    : true
                      ? (
                        <div
                          className='group flex justify-center items-center ml-2 w-8 h-8 hover:bg-primary-50 rounded-lg cursor-pointer'
                          onClick={handleVoiceInputShow}
                        >
                          <Microphone01 className='block w-4 h-4 text-gray-500 group-hover:hidden' />
                          <Microphone01Solid className='hidden w-4 h-4 text-primary-600 group-hover:block' />
                        </div>
                      )
                      : null
                }
                <Tooltip
                  selector='send-tip'
                // htmlContent={
                //   <div>
                //     <div>{t('common.operation.send')} Enter</div>
                //     <div>{t('common.operation.lineBreak')} Shift Enter</div>
                //   </div>
                // }
                >
                  <div className={`${s.sendBtn} w-8 h-8 cursor-pointer rounded-md`} onClick={handleSend}></div>
                </Tooltip>
              </div>
              {
                voiceInputShow && (
                  <VoiceInput
                    onCancel={() => setVoiceInputShow(false)}
                    onConverted={text => setQuery(text)}
                  />
                )
              }
            </div>
          </div>
        )
      }
    </div>
  )
}

export default React.memo(Chat)
