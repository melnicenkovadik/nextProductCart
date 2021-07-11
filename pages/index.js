import styles from '../styles/Home.module.css'
import WriteToCloudFirestore from '../components/cloudFirestore/Write'
import {useUser} from '../firebase/useUser'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import firebase from "firebase";
import {useEffect, useState} from "react";

export default () => {
    const {user, logout} = useUser()
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');

    const searchInputHandler = (value) => {
        setSearch(value)
    }
    useEffect(() => {
        firebase
            .firestore()
            .collection('categories')
            .get()
            .then(data => data.forEach(doc => {
                setCategories(prevState => [...prevState, doc.data()]);
            }))

    }, [])
    useEffect(() => {
        try {
            firebase
                .firestore()
                .collection('products')
                .get()
                .then(data => data.forEach(doc => {
                    setProducts(prevState => ([...prevState, doc.data()]));
                }))
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }, [])
    useEffect(() => {
        console.log(search);
    }, [search]);


    if (user && user.email === 'admin@gmail.com') {
        return (
            <div className={styles.container}>
                <Card>
                    <Card.Body>
                        <Card.Title>{user.name}</Card.Title>
                        <Card.Text>{user.email}</Card.Text>
                        <hr/>
                        {user.profilePic ? <image src={user.profilePic} height={100} width={100}></image> :
                            <p>No profile pic</p>}
                        <hr/>
                        <WriteToCloudFirestore/>
                        <hr/>
                        <div style={{display: 'flex', justifyContent: 'space-around'}}>
                            <Button onClick={() => logout()} style={{width: '100px'}}>Log Out</Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    } else if (user) {
        return (
            <div className={styles.container}>

                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <Button onClick={() => logout()} style={{width: '100px'}}>Log Out</Button>
                </div>

                <main className={styles.main}>
                    <h1 className={styles.title}>
                        {user.name}, Welcome to Test Shop
                    </h1>
                    {/*Search*/}
                    <label htmlFor={'catSelect'}><h2>Select a category:</h2></label>
                    <input type="text" value={search}
                           onChange={(e) => searchInputHandler(e.target.value)}/>
                    {/*Select*/}
                    <label htmlFor={'catSelect'}><h2>Select a category:</h2></label>
                    <select
                        style={{width: '100%', border1: '1px solid black', borderRadius: 10, height: 40}}
                        name={'catSelect'}
                        onChange={e => setCategory(e.target.value)}>
                        <option value={null}/>
                        {
                            products && categories && categories.map(cat => (
                                // SelectItem
                                <option value={cat.name} key={cat.name}> {cat.name}</option>
                            ))
                        }
                    </select>

                    {/*Products*/}
                    <div className={styles.grid}>
                        {
                            products && products?.filter(product => category === product.prod_categories && product.prod_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
                                .map((filteredProduct, i) => {
                                    return (
                                        <div
                                            style={{minWidth: 300}}
                                            key={i}
                                            href={filteredProduct.prod_name}
                                            className={styles.card}
                                        >
                                            {filteredProduct.prod_name && <h3>{filteredProduct.prod_name}</h3>}
                                            {filteredProduct.prod_price && <h5>{filteredProduct.prod_price}</h5>}
                                            {filteredProduct.prod_categories &&
                                            <p>{filteredProduct.prod_categories}</p>}
                                        </div>
                                    )
                                })
                        }
                        {category === null && (
                            products?.filter(product => product.prod_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
                                .map(product => (
                                    <a
                                        style={{width: '100%'}}
                                        key={product.prod_name}
                                        href={product.prod_name}
                                        className={styles.card}
                                    >
                                        {product.prod_name && <h3>{product.prod_name}</h3>}
                                        {product.prod_price && <h5>{product.prod_price}</h5>}
                                        {product.prod_categories && <p>{product.prod_categories}</p>}
                                    </a>
                                ))
                        )}

                        {
                            !products && <div>No data, please auth</div>
                        }

                    </div>
                </main>

                <footer className={styles.footer}>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Powered by{' '}
                        <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo}/>
                    </a>
                </footer>
            </div>
        )
    } else {
        return (
            <div className={styles.container}>

                <div className={styles.logo}><a style={{color: "white"}} href="/auth">Log In!</a></div>
                <main>
                    <div className={styles.grid}>
                        {
                            products && products?.map(product => (
                                <a
                                    style={{width: '100%'}}
                                    key={product.prod_name}
                                    href={product.prod_name}
                                    className={styles.card}
                                >
                                    {product.prod_name && <h3>{product.prod_name}</h3>}
                                    {product.prod_price && <h5>{product.prod_price}</h5>}
                                    {product.prod_categories && <p>{product.prod_categories}</p>}
                                </a>
                            ))
                        }
                        {
                            !products && <div>No data, please auth</div>
                        }

                    </div>
                </main>
            </div>
        )
    }
}
