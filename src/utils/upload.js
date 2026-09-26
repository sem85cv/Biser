import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase.js'

export async function uploadImage(file, folder) {
  const path = `${folder}/${Date.now()}-${file.name}`
  const fileRef = ref(storage, path)
  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}
