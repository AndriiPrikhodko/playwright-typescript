import * as fs from 'fs'
import * as path from 'path'
import * as R from 'ramda'

const templateDir = `${__dirname}/../test-data/templates`
const dataDir = `${__dirname}/../test-data/generated`

/**
 *
 * @param dirname path to template folder
 * @returns
 * 2D array of filenames
 * and their content from template folder
 */
const readFiles = (dirname: string): string[][] => {
    try {
        // fetching file names from template dir
        const filenames = fs.readdirSync(dirname)

        // constructing fullpaths to template files
        const filePaths = filenames.
            map(filename => path.join(dirname, filename))

        // fetching generated content by templates
        const content = filePaths.map(filePath => require(filePath))
        return [filenames, content]
    }
    catch (err) {
        throw err
    }
}

/**
 * fakerData2File saves generated data into
 * genereted test data folder
 */
const fakerData2File = async () => {
    // extracting filenames and data from templates
    const templateData = readFiles(templateDir)

    // saving data from templates
    R.transpose(templateData).map(([filename, content]) => {
        fs.writeFileSync(`${dataDir}/${filename}.json`, JSON.stringify(content))
    })
}

fakerData2File()