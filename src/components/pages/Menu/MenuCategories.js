import React from 'react'
import propTypes from 'prop-types'
import { slugify } from '@open-tender/js'
import MenuCategory from './MenuCategory'

const MenuCategories = ({ categories }) => {
  if (!categories || !categories.length) return null
  return (
    <div className="menu slide-up">
      {categories.map((category) => (
        <div key={category.id} id={slugify(category.name)} name="section">
          <MenuCategory category={category} />
          {category.children.map((category) => (
            <MenuCategory
              key={category.id}
              category={category}
              isChild={true}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

MenuCategories.displayName = 'MenuCategories'
MenuCategories.propTypes = {
  categories: propTypes.array,
}

export default MenuCategories
