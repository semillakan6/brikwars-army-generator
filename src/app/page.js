import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Army List Builder
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unit Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Unit</CardTitle>
            <CardDescription>Create a new unit for your army list</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unitName">Unit Name</Label>
                <Input
                  type="text"
                  id="unitName"
                  placeholder="Enter unit name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Weapons</SelectLabel>
                      <SelectItem value="weapon1">Weapon 1</SelectItem>
                      <SelectItem value="weapon2">Weapon 2</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Armor</SelectLabel>
                      <SelectItem value="armor1">Armor 1</SelectItem>
                      <SelectItem value="armor2">Armor 2</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Add Unit
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Units List */}
        <Card>
          <CardHeader>
            <CardTitle>Army List</CardTitle>
            <CardDescription>Your current army composition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No units added yet. Create a new unit to get started.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
