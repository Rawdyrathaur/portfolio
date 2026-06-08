/* eslint-disable react-refresh/only-export-components */
import { SiUnity, SiReact, SiJavascript, SiPython, SiGit, SiBlender, SiDotnet } from 'react-icons/si'
import { FaUsers, FaBug, FaGamepad, FaRobot, FaCube, FaCode } from 'react-icons/fa'

const TAG_CONFIG = {
  'Unity':            { icon: SiUnity,       color: '#FFFFFF' },
  'Game Development': { icon: FaGamepad,     color: '#FF6B6B' },
  'AI Assets':        { icon: FaRobot,       color: '#A78BFA' },
  'Teamwork':         { icon: FaUsers,       color: '#34D399' },
  'Debugging':        { icon: FaBug,         color: '#F87171' },
  'React':            { icon: SiReact,       color: '#61DAFB' },
  'JavaScript':       { icon: SiJavascript,  color: '#F7DF1E' },
  'Python':           { icon: SiPython,      color: '#3776AB' },
  'Git':              { icon: SiGit,         color: '#F05032' },
  'Blender':          { icon: SiBlender,     color: '#E87D0D' },
  'C#':               { icon: SiDotnet,      color: '#512BD4' },
  'Markdown':         { icon: FaCode,        color: '#83A598' },
  'Design':           { icon: FaCube,        color: '#FB923C' },
  'Preview':          { icon: FaCube,        color: '#94A3B8' },
}

export function TagIcon({ tag, size = 11 }) {
  const config = TAG_CONFIG[tag]
  if (!config) return null
  const Icon = config.icon
  return (
    <Icon
      size={size}
      style={{ color: config.color, display: 'inline', verticalAlign: 'middle', marginRight: 5, flexShrink: 0 }}
    />
  )
}

export function getTagColor(tag) {
  return TAG_CONFIG[tag]?.color || null
}

export default TAG_CONFIG
