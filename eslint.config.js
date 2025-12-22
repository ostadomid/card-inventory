//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import {plugin} from '@tanstack/eslint-plugin-query'

export default [...tanstackConfig, ...plugin.configs["flat/recommended"]]
