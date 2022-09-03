import React from "react"
import { ImageSourcePropType, StyleSheet, View, Animated, useWindowDimensions } from "react-native"

interface Props {
    data: {id: string, title: string, description: string, image: ImageSourcePropType}[],
    scrollX: Animated.Value
} 

const Paginator = ({data, scrollX}: Props) => {

    const {width} = useWindowDimensions()


    return (
        <View style={{flexDirection: 'row', height: 64}}>
            {data.map((_, i) => {

                const inputRange = [(i - 1) * width, i * width, (i + 1) * width]

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: 'clamp'
                })

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp'
                })

                return <Animated.View style={[styles.dot, {width: dotWidth, opacity}]} key={i.toString()} />
            })}
        </View>
    )
}

export default Paginator


const styles = StyleSheet.create({
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#8D58E2',
        marginHorizontal: 8
    }
})