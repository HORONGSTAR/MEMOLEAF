export async function uploadImages(files: File[]) {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append(`${process.env.CLOUDINARY_UPLOAD_PRESET}`, 'memoleaf')
    formData.append(`${process.env.CLOUDINARY_API_KEY}`, '763328519649627')
    formData.append('file', file)
  })
  const res = await fetch(`${process.env.CLOUDINARY_URL}`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('이미지 업로드 실패')
  return res.json()
}
