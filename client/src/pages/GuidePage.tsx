import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import GuideArticle from '../components/GuideArticle'
import { guideBySlug } from '../content/guides'

const GuidePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const guide = slug ? guideBySlug(slug) : undefined

  if (!guide) {
    return <Navigate to="/learn" replace />
  }

  return <GuideArticle guide={guide} />
}

export default GuidePage
