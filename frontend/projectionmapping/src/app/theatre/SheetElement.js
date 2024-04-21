import {useVal} from '@theatre/react'
import {getProject} from '@theatre/core'

const obj = getProject('Demo Project')
    .sheet('Demo Sheet')
    .object('my object', {foo: 'default value of props.foo'})

export default function SheetElement() {
    const value = useVal(obj.props.foo)
    return <div>obj.foo is {value}</div>
}