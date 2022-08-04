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
                    //https://stackoverflow.com/questions/63566372/how-do-navigate-to-a-tab-from-another-tab-using-react-navigation-v5
                    onPress: () => navigation.navigate('Reward', {screen: 'AddReward'}),
                    },
                    {
                    icon: 'reload',
                    label: 'Recurring Task',
                    onPress: () => navigation.navigate('RecurringHome', {screen: 'AddRecurringTask'}),
                    },
                    {
                    icon: 'lead-pencil',
                    label: 'Ad-Hoc Task',
                    onPress: () => navigation.navigate('Home', {screen: 'AddTask'}),
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