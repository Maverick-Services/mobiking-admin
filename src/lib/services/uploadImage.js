export async function uploadImage(dataUrl) {
  const res = await fetch('/api/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: dataUrl }),
  })
  if (!res.ok) throw new Error('Upload failed')
  const { imageURL } = await res.json()
  return imageURL
}
