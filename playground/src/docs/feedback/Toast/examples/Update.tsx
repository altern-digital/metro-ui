import { Button, useToast } from '@altern-digital/metro-ui'

export const title = 'Updating in place'
export const description = 'Show a sticky toast (duration 0), then reuse its id to replace it when the work is done.'

export default function Update() {
  const toast = useToast()
  const upload = () => {
    const id = toast.show({ title: 'uploading 4 photos…', duration: 0 })
    setTimeout(() => toast.success({ id, title: '4 photos uploaded' }), 2000)
  }
  return <Button onClick={upload}>upload</Button>
}
