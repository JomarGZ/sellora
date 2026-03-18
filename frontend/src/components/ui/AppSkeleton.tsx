import type { SkeletonProps } from 'react-loading-skeleton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export function AppSkeleton(props: SkeletonProps) {
    return <Skeleton {...props} />
  }