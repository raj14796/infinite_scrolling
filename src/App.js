import React, { useCallback, useRef, useState } from 'react'
import useBookSearch from './useBookSearch'

const App = () => {

    const [query, setQuery] = useState('')
    const [pageNumber, setPageNumber] = useState(1)

    const { loading, error, hasMore, books } = useBookSearch(query, pageNumber)

    const observer = useRef()
    const lastBookElementRef = useCallback((node) => {
        //console.log('lastBookRef Callback : ', node)
        if (loading) return;
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore)
                setPageNumber((prevPageNumber) => prevPageNumber + 1)
            //console.log('visible')
        })
        if (node) observer.current.observe(node);
    }, [loading, hasMore])

    const handleSearch = (e) => {
        setQuery(e.target.value)
        setPageNumber(1)
    }

    return (
        <>
            <input type='text' value={query} onChange={(e) => handleSearch(e)} placeholder='Search Books' />
            {
                books.map((aBook, index) => {
                    if (index === books.length - 1)
                        return <div ref={lastBookElementRef} key={aBook}>{aBook}</div>
                    else
                        return <div key={aBook}>{aBook}</div>
                })
            }
            {loading && <div>Loading...</div>}
            {error && <div>Error</div>}
        </>
    )
}

export default App
