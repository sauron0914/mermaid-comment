/**
 * @fileoverview 全局的localStorage
 * 用于存储一些模块之间共享的数据，如果是某个模块内部使用，请使用模块内的storage
 * @author 唯然<weiran.zsd@outlook.com>
 */
import { BLS } from '@dian/app-utils'

export const gbls = new BLS({ namespace: 'global' })
