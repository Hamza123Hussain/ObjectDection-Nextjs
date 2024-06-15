'use client'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import * as tf from '@tensorflow/tfjs'
import { useRef } from 'react'
import { load as cocossdload } from '@tensorflow-models/coco-ssd'
import { renderPredictions } from '@/components/RenderPredict'

const ObjectDetect = () => {
  const webcamref = useRef(null)
  const canvasref = useRef(null)
  const [loading, setloading] = useState(true)
  const runcoco = async () => {
    setloading(true)
    const net = await cocossdload()
    setloading(false)
    console.log('coco loaded')
    setInterval(() => {
      ObjectDetections(net)
    }, 10)
  }

  const ObjectDetections = async (net) => {
    if (
      typeof webcamref.current !== 'undefined' &&
      webcamref.current !== null &&
      webcamref.current.video.readyState === 4 &&
      canvasref.current
    ) {
      const detectobjects = await net.detect(
        webcamref.current.video,
        undefined,
        0.7
      )
      console.log(detectobjects)

      const context = canvasref.current.getContext('2d')
      renderPredictions(detectobjects, context)
    }
  }

  const showvideo = () => {
    if (
      typeof webcamref.current !== 'undefined' &&
      webcamref.current !== null &&
      webcamref.current.video.readyState === 4
    ) {
      const videoHeight = webcamref.current.video.videoHeight
      const videoWidth = webcamref.current.video.videoWidth

      webcamref.current.video.width = videoWidth
      webcamref.current.video.height = videoHeight

      canvasref.current.width = videoWidth
      canvasref.current.height = videoHeight
    }
  }
  useEffect(() => {
    showvideo()
    runcoco()
  }, [])

  return (
    <div className="mt-8">
      {loading ? (
        <div className="gradient-text">Loading AI Model...</div>
      ) : (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
          {/* webcam */}
          <Webcam
            ref={webcamref}
            className="rounded-md w-full lg:h-[720px]"
            muted
          />
          {/* canvas */}
          <canvas
            ref={canvasref}
            className="absolute top-0 left-0 z-99999 w-full lg:h-[720px]"
          />
        </div>
      )}
    </div>
  )
}

export default ObjectDetect
