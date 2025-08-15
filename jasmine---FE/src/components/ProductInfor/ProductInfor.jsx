import React from 'react'
import './ProductInfor.css'
const ProductInfor = ({image, name, size}) => {
  return (
    <div className='producInfor'>
        <div className='Image'>
            <img className='imagePro' src={image}></img>
        </div>
        <div>
            <span>
                <p className='ProName'>{name}</p>
            </span>
            <span>
                <p className='ProSize'>{size}</p>
            </span>
        </div>
    </div>
  )
}

export default ProductInfor
