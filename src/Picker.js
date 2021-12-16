import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import Modal from './Modal'
import Hue from './Hue'
import Square from './Square'
import Input from './Input'
import config from './config'

const { squareSize, barSize, crossSize, inputSize } = config

export const PickerWrapper = styled.div`
  user-select: none;
  .swatch {
    width: 100px;
    height: 50px;
    background: ${(p) => p.color};
  }
`

export const PickerOuter = styled.div`
  width: ${squareSize + 20}px;
  display: grid;
  border-radius: 2px;
  background: #ffffff;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);
`

export const PickerInner = styled.div`
  display: grid;
  grid-template-rows: ${squareSize + 20}px ${barSize}px ${inputSize}px;
  align-items: center;
  justify-items: center;
`

export const Inputs = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-items: center;
`

function computeHueX(h) {
  return Math.round((squareSize / 360) * h - barSize / 2)
}

function computeSquareXY(s, l) {
  const t = (s * (l < 50 ? l : 100 - l)) / 100
  const s1 = Math.round((200 * t) / (l + t)) | 0
  const b1 = Math.round(t + l)
  const x = (squareSize / 100) * s1 - crossSize / 2
  const y = squareSize - (squareSize / 100) * b1 - crossSize / 2
  return [x, y]
}

const Picker = () => {
  const [show, setShow] = useState(true)
  const [hue, setHue] = useState(180)
  const [hueX, setHueX] = useState(() => squareSize / 2 - barSize / 2)
  const [square, setSquare] = useState([100, 50])
  const [squareXY, setSquareXY] = useState(() => [
    squareSize - crossSize / 2,
    crossSize / -2
  ])
  const [offsetTop, setOffsetTop] = useState(0)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [color, setColor] = useState(`hsla(180, 100%, 50%, 1)`)
  const [animate, setAnimate] = useState(false)

  const modal = useRef(null)

  useEffect(() => {
    function setOffsets() {
      setOffsetTop(modal.current.offsetTop)
      setOffsetLeft(modal.current.offsetLeft)
    }
    if (show) {
      setOffsets()
      window.addEventListener('resize', setOffsets)
    } else {
      window.removeEventListener('resize', setOffsets)
    }

    return () => {
      window.removeEventListener('resize', setOffsets)
    }
  }, [show])

  useEffect(() => {
    setColor(`hsla(${hue}, ${square[0]}%, ${square[1]}%, 1)`)
  }, [hue, square])

  function onHueChange(n) {
    setAnimate(true)
    setHue(n)
    setHueX(computeHueX(n))
  }

  function onSaturationChange(n) {
    setAnimate(true)
    setSquare([n, square[1]])
    setSquareXY(computeSquareXY(n, square[1]))
  }

  function onLightnessChange(n) {
    setAnimate(true)
    setSquare([square[0], n])
    setSquareXY(computeSquareXY(square[0], n))
  }

  return (
    <>
      <PickerWrapper color={color}>
        <div className='swatch' onClick={() => setShow(true)} />
        <Modal modal={modal} show={show} onClose={() => setShow(false)}>
          <PickerOuter>
            <PickerInner>
              <Square
                hue={hue}
                squareXY={squareXY}
                offsetTop={offsetTop}
                offsetLeft={offsetLeft}
                animate={animate}
                setSquare={setSquare}
                setSquareXY={setSquareXY}
                setAnimate={setAnimate}
              />
              <Hue
                hueX={hueX}
                offsetLeft={offsetLeft}
                animate={animate}
                setHueX={setHueX}
                setHue={setHue}
                setAnimate={setAnimate}
              />
              <Inputs>
                <Input
                  label='H'
                  value={hue}
                  min={0}
                  max={360}
                  defaultValue={180}
                  setValue={onHueChange}
                />
                <Input
                  label='S'
                  value={square[0]}
                  min={0}
                  max={100}
                  defaultValue={100}
                  setValue={onSaturationChange}
                />
                <Input
                  label='L'
                  value={square[1]}
                  min={0}
                  max={100}
                  defaultValue={50}
                  setValue={onLightnessChange}
                />
              </Inputs>
            </PickerInner>
          </PickerOuter>
        </Modal>
      </PickerWrapper>
    </>
  )
}

export default Picker