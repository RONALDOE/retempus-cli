/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import SearchBar from '@components/SearchBar'
export default function Search() {
    const { fileType } = useParams<{ fileType: string }>()
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id'); // Obtiene el parámetro "id"
    const name = searchParams.get('name'); // Obtiene el parámetro "name"
    const rangeDate = searchParams.get('rangeDate'); // Obtiene el parámetro "rangeDate"
    console.log({ id, name, rangeDate });


  return (
    <div>
        <SearchBar />
    </div>
  )
}
