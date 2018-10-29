export enum DeviceType {
    Light
}

export enum DeviceCapabilities {
    Brightness = 0,
    Color = 1 << 0,
    Power = 1 << 1
}

export const devices = [
    {
        id: 'couch-bottom-left',
        type: DeviceType.Light,
        capabilities: DeviceCapabilities.Power | DeviceCapabilities.Color | DeviceCapabilities.Brightness,
        name: 'couch bottom left',
        endpoint: 'http://192.168.1.115/api/lights/1'
    },
    {
        id: 'couch-bottom-middle',
        type: DeviceType.Light,
        capabilities: DeviceCapabilities.Power | DeviceCapabilities.Color | DeviceCapabilities.Brightness,
        name: 'couch bottom middle',
        endpoint: 'http://192.168.1.115/api/lights/2'
    },
    {
        id: 'couch-bottom-right',
        type: DeviceType.Light,
        capabilities: DeviceCapabilities.Power | DeviceCapabilities.Color | DeviceCapabilities.Brightness,
        name: 'couch bottom right',
        endpoint: 'http://192.168.1.115/api/lights/3'
    }
]