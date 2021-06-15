import { useState, useEffect } from 'react'
import axios from 'axios'

const UseBookSearch = (query, pageNumber) => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [books, setBooks] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(()=>{
        setBooks([])
    },[query])

    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel;
        axios({
            method: 'GET',
            url: 'http://openlibrary.org/search.json',
            params: { q: query, page: pageNumber },
            cancelToken: new axios.CancelToken((c) => cancel = c)
        }).then((res) => {
            const newBooks = res.data.docs.map((b) => b.title)
            setBooks((prevBooks) => {
                return [...new Set([...prevBooks, ...newBooks])]       ///Set is used to find the unique elements
            })
            setHasMore(res.data.docs.length > 0)
            setLoading(false)
            //console.log('useBookSearch axios : ',res.data)
        }).catch((err) => {
            if (axios.isCancel(err)) return;
            setError(true)
        })

        return () => cancel();   //this is used to render the last data only

    }, [query, pageNumber])

    return {
        loading,
        error,
        hasMore,
        books
    }
}

export default UseBookSearch
