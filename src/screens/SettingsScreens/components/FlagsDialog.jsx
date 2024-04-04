import React, { useCallback, useEffect } from 'react'
import { Button, Dialog, Portal, RadioButton, Text } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { setSettings } from '../../../store/settings'
import { KeyboardAvoidingView, View } from 'react-native'
import { useUIState } from '../../../store/ui'

export function FlagsDialog ({ visible, settings, styles, onDialogDone }) {
  const dispatch = useDispatch()

  const [dialogVisible, setDialogVisible] = useUIState('FlagsDialog', 'dialogVisible', visible)
  const [value, setValue] = useUIState('FlagsDialog', 'value', '')

  useEffect(() => {
    setValue(settings?.dxFlags || 'dx')
  }, [setValue, settings])

  const handleAccept = useCallback(() => {
    dispatch(setSettings({ dxFlags: value }))
    setDialogVisible(false)
    onDialogDone && onDialogDone()
  }, [dispatch, value, setDialogVisible, onDialogDone])

  const handleCancel = useCallback(() => {
    setValue(settings.theme)
    setDialogVisible(false)
    onDialogDone && onDialogDone()
  }, [setValue, settings.theme, setDialogVisible, onDialogDone])

  return (
    <Portal>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={'height'}>
        <Dialog visible={dialogVisible} onDismiss={handleCancel}>
          <Dialog.Icon icon={'flag'} />
          <Dialog.Title style={{ textAlign: 'center' }}>Show Flags</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(v) => setValue(v)}
              value={value}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value="dx" />
                <Text onPress={() => setValue('dx')} style={styles.rowText}>Only for DX contacts</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value="all" />
                <Text onPress={() => setValue('all')} style={styles.rowText}>For all contacts</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value="none" />
                <Text onPress={() => setValue('none')} style={styles.rowText}>Don't show any flags</Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCancel}>Cancel</Button>
            <Button onPress={handleAccept}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </KeyboardAvoidingView>
    </Portal>
  )
}
