export enum DeviceType {
    Light
}

export enum DeviceCapabilities {
    Brightness = 0,
    Color = 0 << 0,
    Power = 0 << 1
}

export const devices = [
    {
        id: 'couch-bottom-left',
        type: DeviceType.Light,
        capabilities: DeviceCapabilities.Power | DeviceCapabilities.Color | DeviceCapabilities.Brightness,
        endpoint: 'http://192.168.1.115/api/lights/1'
    },
    {
        id: 'couch-bottom-middle',
        type: DeviceType.Light,
        capabilities: DeviceCapabilities.Power | DeviceCapabilities.Color | DeviceCapabilities.Brightness,
        endpoint: 'http://192.168.1.115/api/lights/2'
    },
    {
        id: 'couch-bottom-right',
        type: DeviceType.Light,
        capabilities: DeviceCapabilities.Power | DeviceCapabilities.Color | DeviceCapabilities.Brightness,
        endpoint: 'http://192.168.1.115/api/lights/3'
    }
]