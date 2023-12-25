import { TypedUseSelectorHook, useDispatch as ruseDispatch, useSelector as ruseSelector } from 'react-redux'
import * as models from '@/models'

type ReturnFuncType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : Record<string, never>;

type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType]

// 联合类型转化成交集类型
type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never

// 联合类型转化成Obj类型
type UnionToObject<T extends string> = {
  [K in T]: any
}

// 获取全部的modelsl类型
type RootState = typeof models

// 获取model中的key "state" | "enhancedEffects" | "reducers" | "effects"
type ReduxType = keyof UnionToIntersection<RootState[keyof RootState]>

/**
 * 防止访问可能出现不存在的属性
 * 若是访问了对象中一个不存在的key，会造成ts识别错误，会对交集类型造成影响，这里返回一个{}
 * 部分model文件并没有enhancedEffects这个key，UseDispatch返回值交集中取了这个值，若是报错，会对effects、reducers等造成影响
*/
type GetPresenceAttributes<T, P> = P extends keyof T ? T[P] : Record<string, never>

/**
 * 获取models的属性
*/
type GetRootAttr<T, P extends string> = {
  [K in keyof T]: GetPresenceAttributes<T[K], P>
}

/**
 * 获取类似effects,这种返回的是一个返回类型为obj的函数类型
*/
type GetRootEffects<T, P extends ReduxType> = {
  // @ts-ignore: 暂时没有好的方案处理这个错误提示
  [K in keyof T]: ReturnFuncType<T[K][P]>
}

// 获取 enhancedEffects
type RootEnhancedEffectsType = GetRootAttr<RootState, 'enhancedEffects'>

// 获取enhancedEffects中 createQuery 第一个参数的state
type GetEnhancedEffectsAttr<T, P extends string> = {
  // @ts-ignore: 暂时没有好的方案处理这个错误提示
  [K in keyof T]: UnionToObject<ValueOf<T[K]>[P]>
}

// 获取enhancedEffects中 createQuery 第二个参数体
type GetCreateQueryResolverType<T, P extends string> = {
    // @ts-ignore: 暂时没有好的方案处理这个错误提示
    // 因为有的model可能没有enhancedEffects这个key，返回就是 Record<string, never>, 再次递归就是never了，所以直接返回就ok
    [K in keyof T]: T[K] extends Record<string, never>
      ? Record<string, never>
      : P extends keyof T[K]
        ? T[K][P]
        : GetCreateQueryResolverType<T[K], P>
}

export const useSelector: TypedUseSelectorHook<GetRootAttr<RootState, 'state'> & GetEnhancedEffectsAttr<RootEnhancedEffectsType, 'state'>> = ruseSelector

interface UseDispatch{
  (): GetCreateQueryResolverType<RootEnhancedEffectsType, 'resolver'> & GetRootAttr<RootState, 'reducers'> & GetRootEffects<RootState, 'effects'>
}

export const useDispatch: UseDispatch = ruseDispatch
