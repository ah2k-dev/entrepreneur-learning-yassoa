import { createTheme, InputBase, NavLink, NumberInput, PasswordInput, Select, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';


export const globalInputStyle = {
    defaultProps: {
        variant: 'filled',
        styles: {
            label: {
                color: '#141B43'
            },
            input: {
                backgroundColor: '#f6fbff',
                border: '1px solid #F6F5F5',
                color: '#535353',
                fontFamily: 'Poppins',
                fontWeight: '400',
                fontSize: '16px',
                height: '45px',
                borderRadius: '10px',
            },
            wrapper: {
                marginTop: '0'
            },
            description: {
                display: 'inline',
                marginLeft: '10px'
            }
        }
    },
};
const globalSelectStyle = {
    defaultProps: {
        variant: 'filled',
        styles: {
            label: {
                color: '#141B43'
            },
            input: {
                backgroundColor: '#f6fbff',
                border: '0px',
                fontFamily: 'Poppins',
                color: '#535353',
                fontWeight: '400',
                fontSize: '16px',
                height: '45px',
                borderRadius: '10px'
            }, wrapper: {
                marginTop: '0'
            },
            description: {
                display: 'inline',
                marginLeft: '10px'
            }
        }
    },
};
const globalNavLinkStyle = {
    defaultProps: {
        variant: 'subtle',
        color: "teal",
        styles: {
            label: {
                color: '#535353',
                fontSize: '15px',
                fontFamily: 'Poppins',
            }
        }
    },
};
export const theme = createTheme({
    components: {
        TextInput: TextInput?.extend(globalInputStyle),
        InputBase: InputBase?.extend(globalInputStyle),
        NumberInput: NumberInput?.extend(globalInputStyle),
        DateInput: DateInput?.extend(globalInputStyle),
        PasswordInput: PasswordInput?.extend(globalInputStyle),
        NavLink: NavLink?.extend(globalNavLinkStyle),
        Select: Select?.extend(globalSelectStyle),
    },
    fontFamily: 'Poppins'

});