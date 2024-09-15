import Fuse from 'fuse.js'

/*
 * Brands db holds list of brands of discs
 */
import brands from '../brands-db.json'
/*
 * Discs db holds different discs of models available from brands
 */
import discs from '../discs-db.json'

import sampleInput from '../sample-input.json'


const words: { word: string }[] = sampleInput.data.text.words

const fuseOptions = {
    includeScore: true,
    threshold: 0.2,
    keys: ['attributes.MoldName', 'attributes.BrandName']
}

var fuse: Fuse<any> = new Fuse(brands.data, fuseOptions)

words.forEach(word => {
    if (word['category'] == 'PhoneNumber') return

    const brandCategories = []

    const result = fuse.search(word.word)

    result.forEach(res => {
        if (!brandCategories.includes(res.item.attributes.BrandName))
        brandCategories.push(res.item.attributes.BrandName)
    })

    word['brandCategories'] = brandCategories
})

var fuse: Fuse<any> = new Fuse(discs.data, fuseOptions)

words.forEach(word => {
    if (word['category'] == 'PhoneNumber') return

    const discCategories = []

    const result = fuse.search(word.word)

    result.forEach(res => {
        if (!discCategories.includes(res.item.attributes.BrandName))
            discCategories.push(res.item.attributes.BrandName)
    })

    word['discCategories'] = discCategories
})

const phoneNumberPatterns = [
    /* (123) */
    /^\(\d{3}\)/,

    // 123-
    /\d{3}\-/,

    // -456
    /\-\d{3}/,

    // -4566
    /\-\d{4}/,
]

words.forEach(word => {
    /*
     * If matches anything not allowed in phone number, ignore
     */
    if (/[^\-\d\(\)]{1}/.test(word.word)) {
        return
    }

    for (const pnp of phoneNumberPatterns) {
        if (pnp.test(word.word)) {
            word['category'] = 'PhoneNumber'
            break
        }
    }
})

console.table(words)
