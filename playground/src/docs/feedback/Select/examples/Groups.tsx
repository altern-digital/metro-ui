import { Select } from '@altern-digital/metro-ui'
import { VscDeviceMobile, VscVm } from 'react-icons/vsc'

export const title = 'Groups, icons and search'
export const description = 'Options with a group are listed under it. searchable adds a filter box; clearable an x.'

export default function Groups() {
  return (
    <Select
      label="device"
      placeholder="choose a device"
      searchable
      clearable
      style={{ width: 280 }}
      options={[
        { value: 'surface', label: 'surface laptop', icon: VscVm, group: 'pcs' },
        { value: 'desk', label: 'office desktop', icon: VscVm, group: 'pcs' },
        { value: 'lumia', label: 'lumia 950', icon: VscDeviceMobile, group: 'phones' },
        { value: 'lumia2', label: 'lumia 1520', icon: VscDeviceMobile, group: 'phones', disabled: true },
        { value: 'vm', label: 'test vm', icon: VscVm, group: 'virtual' },
      ]}
    />
  )
}
