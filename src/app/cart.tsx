import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { Product } from "@/components/product";
import { ProductCarProps, useCartStore } from "@/stores/cart.store";
import { formatCurrency } from "@/utils/functions/format-currency";
import { View, Text, ScrollView, Alert, Linking } from "react-native";
import { KeyboardAwareScrollView  } from "react-native-keyboard-aware-scroll-view"
import { Feather } from "@expo/vector-icons"
import { LinkButton } from "@/components/link-button";
import { useCallback, useState } from "react";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = "5511994749422"

export default function Cart() {
  const [address, setAddress] = useState<string>("")
  const cartStore = useCartStore();
  const navigation = useNavigation()

  const total = formatCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity!,
      0
    )
  );

  const fnRemoveProductCart = useCallback((product: ProductCarProps) => {
    Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
      { text: "Cancelar" },
      { text: "Remover", onPress: () => cartStore.removeCart(product.id)}
    ])
  }, [])

  const fnSendOrder = useCallback(() => {
    if (address.trim().length === 0) return Alert.alert("Pedido", "Informe os dados para entrega")

    const products = cartStore.products.map((product) => `\n ${product.quantity} - ${product.title}`).join("")

    const message = `
    🍔 Novo Pedido
    \n Entregar em: ${address}

    ${products}

    \n Valor total: ${total}
    `;

    Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`)

    cartStore.clearCart()
    navigation.goBack()
  }, [address])


  return (
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho" />
      <KeyboardAwareScrollView>
        <ScrollView>
          <View className="p-5 flex-1">
            {cartStore.products.length > 0 ? (
              <View className="border-b border-slate-700">
              {cartStore.products.map((product) => (
                <Product data={product} key={product.id} onPress={() => fnRemoveProductCart(product)} />
              ))}
            </View>
          ) : (
            <Text className="font-body text-slate-400 text-center my-8">
              Seu carrinho está vazio
            </Text>
          )}

          <View className="flex-row gap-2 items-center mt-5 mb-4">
            <Text className="text-white text-xl font-subtitle">Total</Text>
            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
          </View>

          <Input
            placeholder="Informe endereço de entrega, com rua, bairro, CEP e complemento"
            onChangeText={setAddress}
            onSubmitEditing={fnSendOrder}
            blurOnSubmit
            returnKeyType="next"
          />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
      <View className="p-5 gap-5">
        <Button onPress={fnSendOrder}>
          <Button.Text>Enviar Pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>
        <LinkButton href='/' title="Voltar ao cardápio" />
      </View>
    </View>
  );
}
