import firebase from 'firebase/app'
import 'firebase/firestore'
import {useUser} from '../../firebase/useUser'
import Button from 'react-bootstrap/Button'
import {useEffect, useState} from "react";

const WriteToCloudFirestore = () => {
    const {user} = useUser()
    const [ProdName, setProdName] = useState('');
    const [ProdPrice, setProdPrice] = useState('');
    const [ProdCategories, setProdCategories] = useState([])
    const [categoryToAdd, setCategoryToAdd] = useState([])
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        firebase
            .firestore()
            .collection('categories')
            .get()
            .then(data => data.forEach(doc => {
                setCategories(prevState => [...prevState, doc.data()]);
            }))

    }, [])
    const sendData = () => {
        try {
            if (ProdCategories && ProdPrice && ProdName) {
                firebase
                    .firestore()
                    .collection('products')
                    .doc() // leave as .doc() for a random unique doc name to be assigned
                    .set({
                        authorId: user.id,
                        prod_name: ProdName,
                        prod_price: ProdPrice,
                        prod_categories: ProdCategories,
                    })
                    .then(alert('Product was successfully sent to cloud firestore!'))
            }
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }
    const addCategory = () => {
        try {
            firebase
                .firestore()
                .collection('categories')
                .doc() // leave as .doc() for a random unique doc name to be assigned
                .set({
                    name: categoryToAdd,
                })
                .then(alert('Product was successfully sent to cloud firestore!'))
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }
    return (
        <>
            <div style={{margin: '5px 0', backgroundColor: 'cyan'}}>
                <h3>Add a product</h3>
                <hr/>
                <label htmlFor={'ProdName'}>Name</label>
                <input style={{border: 2}} name={'ProdName'} value={ProdName}
                       onChange={(e) => setProdName(e.target.value)}/>
                <hr/>
                <label htmlFor={'ProdCategories'}>Category</label>
                <select style={{border: 2}}
                        name={'ProdCategories'}
                        onChange={e => setProdCategories(e.target.value)}>
                    <option></option>

                    {
                        categories && categories.map(cat => (
                            <option value={cat.name} key={cat.name}> {cat.name}</option>
                        ))
                    }
                </select>

                <hr/>
                <label htmlFor={'ProdPrice'}>Price</label>
                <input style={{border: 2}} name={'ProdPrice'} value={ProdPrice}
                       onChange={(e) => setProdPrice(e.target.value)}/>
                <hr/>
                <Button onClick={sendData} style={{width: '100%'}}>Add Product</Button>
            </div>
            <div style={{margin: '5px 0', backgroundColor: 'cyan'}}>
                <h3>Add a category</h3>
                <hr/>
                <label htmlFor={'cat'}>Name</label>
                <input style={{border: 2}} name={'cat'} value={categoryToAdd}
                       onChange={(e) => setCategoryToAdd(e.target.value)}/>
                <hr/>
                <Button onClick={addCategory} style={{width: '100%'}}>Add Category</Button>
            </div>
        </>
    )
}

export default WriteToCloudFirestore
