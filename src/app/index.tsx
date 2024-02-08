import { CategoryButton } from "@/components/category-button"
import { Header } from "@/components/header"
import { View, Text, FlatList, SectionList } from "react-native"
import { CATEGORIES, MENU, ProductProps } from "@/utils/data/products"
import { useState, useRef, useCallback } from "react"
import { Product } from "@/components/product"
import { Link } from "expo-router"
import { useCartStore } from "@/stores/cart.store"

export default function Home() {
  const sectionListRef = useRef<SectionList<ProductProps>>(null)
  const cartStore = useCartStore()
  const [category, setCategory] = useState(CATEGORIES[0])

  const cartQuantityItem = cartStore.products.reduce((total, product) => total + product.quantity!, 0)

  const fnSelectedCategory = useCallback((category: string) => {
    setCategory(category)
    const sectionIndex = CATEGORIES.findIndex(item => item === category)

    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        sectionIndex,
        itemIndex: 0
      })
    }

  }, [sectionListRef])

  return (
    <View>
      <Header title="Cardápio" cardQuantityItems={cartQuantityItem} />
      <FlatList 
        data={CATEGORIES}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <CategoryButton
            title={item}
            isSelected={item === category}
            onPress={() => fnSelectedCategory(item)}
          />
        )}
        horizontal
        className="mt-5 max-h-10 h-full"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
      />

      <SectionList
        className="px-5 flex-1"
        ref={sectionListRef}
        sections={MENU}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <Link href={`/product/${item.id}`} asChild>
            <Product data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title }}) => (
          <Text className="text-white text-xl font-heading mt-8 mb-3">{title}</Text>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  )
}