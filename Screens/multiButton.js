import { FAB, Portal, Provider } from 'react-native-paper';
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';


//FAB Plus Button
export default MultiButton= () => {
    //FAB multi-button button
    const [state, setState] = React.useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;

    const navigation = useNavigation();

    return(
        <Provider>
            <Portal>
                <FAB.Group
                open={open}
                icon={open ? 'close' : 'plus'}
                actions={[
                    { icon: 'plus', onPress: () => console.log('Pressed add') },
                    {
                    icon: 'gift',
                    label: 'Rewards',
                    onPress: () => console.log('Pressed rewards'),
                    },
                    {
                    icon: 'reload',
                    label: 'Recurring Task',
                    onPress: () => navigation.navigate('DateTimePickerApp'),
                    },
                    {
                    icon: 'lead-pencil',
                    label: 'Ad-Hoc Task',
                    onPress: () => navigation.navigate('AddTask'),
                    },
                ]}
                onStateChange={onStateChange}
                onPress={() => {
                    if (open) {
                    // do something if the speed dial is open
                    console.log('hello')
                    }
                }}
                />
            </Portal>
        </Provider>
    )
}