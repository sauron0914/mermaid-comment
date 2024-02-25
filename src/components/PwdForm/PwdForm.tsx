/**
 * 重置密码/修改密码表单
 * */
import { CompanyInfos } from '@/api/types/User.type'
import { modifyPwd, resetExchangePwd, resetPwd } from '@/api/User'
import { AppUrls } from '@/router/Routes'
import AqButton from '@components/AqButton/AqButton'
import AqInput from '@components/AqInput/AqInput'
import Toast from '@components/Toast/Toast'
import { Form } from '@livelybone/form'
import { useForm } from '@utils/FormHook'
import { inputItemChange, isAllItemFilled } from '@livelybone/react-form'
import { FormItems } from '@utils/FormItems'
import { getWithoutProperties } from '@utils/Object'
import { getQuerystring } from '@utils/Querystring'
import { CurrentEmail, ForceChangePassword } from '@utils/Storage'
import React, { ChangeEvent, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import './PwdForm.scss'

const getItemIds = (
    forceChange: boolean,
    isSignPwdReset: boolean,
    isExchangePwdReset: boolean,
): Parameters<typeof FormItems['getItems']>[0] =>
    forceChange || isSignPwdReset
        ? ['newPwd', 'confirmPwd']
        : isExchangePwdReset
        ? ['newExchangePwd', 'confirmExchangePwd']
        : ['oldPwd', 'newPwd', 'confirmPwd']

interface PwdFormProps {
    /**
     * 是否为重置登录密码，default: false
     * */
    isSignPwdReset?: boolean

    /**
     * 是否为重置交易密码，default: false
     * */
    isExchangePwdReset?: boolean

    onSubmitted?(): void
}

const PwdForm: React.FC<PwdFormProps> = ({
    isSignPwdReset = false,
    isExchangePwdReset = false,
    onSubmitted,
}) => {
    const forceChangePassword = !!ForceChangePassword.get()

    const ids = useMemo(() => {
        return getItemIds(
            forceChangePassword,
            isSignPwdReset,
            isExchangePwdReset,
        )
    }, [forceChangePassword, isExchangePwdReset, isSignPwdReset])

    const form = useForm(ids) as Form<any, any>
    ;(form.items[0] as any).placeholder = window.location.pathname.endsWith(
        'pwd',
    )
        ? '请输入新密码'
        : '请输入原密码'
    ;(form.items[1] as any).placeholder = '请输入新密码（6-20位字母或数字）'

    const submit = (data: any) => {
        ;(isSignPwdReset
            ? resetPwd({
                  email,
                  password: data.password,
                  code,
              })
            : isExchangePwdReset
            ? resetExchangePwd({
                  email,
                  password: data.password,
                  code,
              })
            : modifyPwd({ ...data })
        )
            .then(() => onSubmitted && onSubmitted())
            .catch(e => {
                form.$errorText = e.message
                Toast.error(e)
            })
    }

    const userInfo = useSelector<any, CompanyInfos>(
        state => state.user.userInfo,
    )

    const email =
        getQuerystring('email') ||
        CurrentEmail.get() ||
        (userInfo && userInfo.contactEmail)
    const code = getQuerystring('code')

    const txt = useMemo(() => {
        if (!(isSignPwdReset || isExchangePwdReset) && !forceChangePassword) {
            return { title: '修改登录密码', btnTxt: '确认修改' }
        }
        if (isExchangePwdReset)
            return { title: '重置交易密码', btnTxt: '确认重置交易密码' }
        return { title: '重置登录密码', btnTxt: '确认重置登录密码' }
    }, [isSignPwdReset, isExchangePwdReset, forceChangePassword])

    const buttonEnabled = isSignPwdReset
        ? email && code && isAllItemFilled(form)
        : isAllItemFilled(form)

    const resetError =
        (isSignPwdReset || isExchangePwdReset) && (!email || !code)
            ? '您的重置链接不正确'
            : ''

    return (
        <>
            <h2 className="form-name">{txt.title}</h2>
            <span className="tip">
                {forceChangePassword &&
                    !(isSignPwdReset || isExchangePwdReset) &&
                    '*为了您的账号安全，首次登录时需重置账号登录密码'}
            </span>
            {email && <span className="signin-email">{email}</span>}
            {form.items.map((item, i) => (
                <AqInput
                    {...getWithoutProperties(item, ['label', 'value', 'valid'])}
                    defaultValue={item.value}
                    onChange={(ev: ChangeEvent) => {
                        inputItemChange(form, item.name, ev)
                        if (item.id.startsWith('new')) {
                            form.updateOptions({
                                optionsForValidatorAndFormatter: {
                                    oldVal: form.data[item.name],
                                },
                            })
                        }
                    }}
                    onBlur={() => form.itemValidate(item.name, true)}
                    key={i}
                />
            ))}
            <AqButton
                className="btn-submit aq-button-red"
                fill
                onClick={() => form.submit().then(submit)}
                disabled={!buttonEnabled}
            >
                {txt.btnTxt}
            </AqButton>
            {(resetError || form.$errorText) && (
                <span className="error">{resetError || form.$errorText}</span>
            )}
            <Link className="link-bottom" to={AppUrls.SignIn()}>
                {forceChangePassword
                    ? '返回登录'
                    : isSignPwdReset
                    ? '去登录'
                    : ''}
            </Link>
        </>
    )
}

export default PwdForm
